// Paste into the "FREE Lead Magnet Leads" sheet: Extensions → Apps Script (replace everything).
// Receives every lead from ceoturbo.com (/api/audit, /api/cal-webhook, /api/lead, /api/shopify-webhook) and files it on
// the right tab, under the matching column header. Columns can be reordered or hidden in the
// sheet: rows are matched by header NAME, not position. Setup steps: docs/leads-google-sheet.md

const SECRET = "PASTE_YOUR_LEADS_WEBHOOK_SECRET_HERE"; // same value as LEADS_WEBHOOK_SECRET in Vercel
const SHEET_ID = "1sToqSfGp6eDAowaqvmtKxDPUHqDGNUruWsnIUzkr1GI"; // FREE Lead Magnet Leads (works even if this script is not attached to the sheet)

// header label shown in the sheet  ->  field name sent by the website
const ATTR = {
  Source: "utm_source",
  Medium: "utm_medium",
  Campaign: "utm_campaign",
  "Ad / content": "utm_content",
  Keyword: "utm_term",
  "Google click ID": "gclid",
  "Microsoft click ID": "msclkid",
  "Meta click ID": "fbclid",
  "TikTok click ID": "ttclid",
  "Landing page": "landing",
};

const TABS = {
  // Brand Boost quiz: everyone who answered the questions and left their details. "Booked?" flips to
  // "Yes" automatically when the same person books — anyone still "No" is your follow-up list.
  "Call Quiz Leads": Object.assign(
    {
      Received: "receivedAt",
      Name: "name",
      Phone: "phone",
      Email: "email",
      Company: "business",
      "What they do": "audience",
      Website: "website",
      "Biggest goal": "goal",
      "Holding them back": "blockers",
      "Monthly budget": "budget",
      "How soon": "timeline",
      "#1 move shown": "move",
      "Text opt-in": "smsOptIn",
      "Booked?": "booked",
      "Call time": "callTime",
    },
    ATTR,
    { "Form page": "page", "Quiz ID": "quizId" }
  ),
  "Free Check Leads": Object.assign(
    {
      Received: "receivedAt",
      Name: "name",
      Phone: "phone",
      Email: "email",
      Company: "business",
      Type: "type",
      "What they do": "what",
      City: "city",
      Website: "website",
      "Google profile claimed": "gbp",
      "Google reviews": "reviews",
      Press: "press",
      "Name search rank": "nameRank",
      "Text opt-in": "smsOptIn",
      "Overall score": "score",
      SEO: "seo",
      "AI answers": "aeo",
      Local: "geo",
      "Reviews score": "reviewsScore",
      "Top issues": "topIssues",
    },
    ATTR,
    { "Form page": "page" }
  ),
  "Booked Calls": Object.assign(
    {
      Received: "receivedAt",
      Name: "name",
      Phone: "phone",
      Email: "email",
      Company: "businessName",
      "What they do": "whatTheyDo",
      Website: "website",
      "Biggest goal": "goal",
      "Holding them back": "blockers",
      "Monthly budget": "budget",
      "How soon": "timeline",
      "Call time": "startTime",
      Ends: "endTime",
      "Time zone": "timeZone",
      Event: "event",
      "Meeting link": "meetingLink",
      Notes: "notes",
      "Booked from": "source",
      "Booking ID": "uid",
    },
    ATTR,
    { "Form page": "page", "Quiz ID": "quizId" }
  ),
  "Card Orders": Object.assign(
    {
      Received: "receivedAt",
      Name: "name",
      Phone: "phone",
      Email: "email",
      Company: "business",
      Type: "type",
      "Order #": "orderNumber",
      Items: "items",
      Quantity: "quantity",
      Total: "total",
      Payment: "paymentStatus",
      "Ship to": "shipTo",
      Pack: "pack",
      Style: "style",
      Product: "product",
      Note: "note",
    },
    ATTR,
    { "Form page": "page", "Order ID": "orderId" }
  ),
  "Other Leads": Object.assign({ Received: "receivedAt", Name: "name", Phone: "phone", Email: "email", Company: "business", Type: "type", Note: "note" }, ATTR, { "Form page": "page" }),
};

const TYPE_LABEL = { "audit-business": "Business", "audit-artist": "Artist", "order-request": "Order request", "shopify-order": "Paid order", "brand-boost-quiz": "Call quiz" };

function tabFor(type) {
  if (type === "booking") return "Booked Calls";
  if (type === "brand-boost-quiz") return "Call Quiz Leads";
  if (String(type).indexOf("audit") === 0) return "Free Check Leads";
  if (type === "order-request" || type === "shopify-order") return "Card Orders";
  return "Other Leads";
}

/** When someone books, mark their quiz row as booked (matched by Quiz ID, else by email). */
function markQuizBooked(book, data) {
  const sheet = book.getSheetByName("Call Quiz Leads");
  if (!sheet || sheet.getLastRow() < 2) return;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const col = function (h) {
    return headers.indexOf(h) + 1;
  };
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  const email = String(data.email || "").toLowerCase();
  for (let i = rows.length - 1; i >= 0; i--) {
    const byId = data.quizId && col("Quiz ID") > 0 && String(rows[i][col("Quiz ID") - 1]) === String(data.quizId);
    const byEmail = !data.quizId && email && col("Email") > 0 && String(rows[i][col("Email") - 1]).toLowerCase() === email;
    if (!byId && !byEmail) continue;
    const r = i + 2;
    if (col("Booked?") > 0) sheet.getRange(r, col("Booked?")).setValue("Yes");
    if (col("Call time") > 0 && data.startTime) sheet.getRange(r, col("Call time")).setValue(display("startTime", data.startTime));
    if (col("Status") > 0) sheet.getRange(r, col("Status")).setValue("Booked");
    return;
  }
}

function display(field, value) {
  if (value === undefined || value === null || value === "") return "";
  // The site prefixes "'" to values starting with = + - @ so they can't run as formulas. Phone cells
  // are plain text, so the prefix is not needed there (and would show).
  if (field === "phone") return String(value).replace(/^'(?=[=+\-@])/, "");
  if (field === "smsOptIn") return value === true || value === "true" ? "Yes" : "No";
  if (field === "type") return TYPE_LABEL[value] || value;
  if (field === "receivedAt" || field === "startTime" || field === "endTime") {
    const d = new Date(value);
    if (!isNaN(d)) return d;
  }
  return value;
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (err) {
    return ContentService.createTextOutput("bad json");
  }
  if (data.secret !== SECRET) return ContentService.createTextOutput("forbidden");

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const name = tabFor(data.type);
    const map = TABS[name];
    const book = SpreadsheetApp.openById(SHEET_ID);
    let sheet = book.getSheetByName(name);
    if (!sheet) {
      sheet = book.insertSheet(name);
      const labels = Object.keys(map).concat(["Status", "Follow-up notes"]);
      sheet.getRange(1, 1, 1, labels.length).setValues([labels]).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    // New columns added to the website later (e.g. "Quiz ID") are appended to an existing tab automatically.
    const missing = Object.keys(map).filter(function (h) {
      return headers.indexOf(h) === -1;
    });
    if (missing.length) {
      sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]).setFontWeight("bold");
      headers = headers.concat(missing);
    }

    // A booking is only recorded once, even if Cal.com retries the webhook.
    // Each booking / paid order is recorded once, even if Cal.com or Shopify retries the webhook.
    const dedupe = name === "Booked Calls" ? ["Booking ID", data.uid] : name === "Card Orders" && data.type === "shopify-order" ? ["Order ID", data.orderId] : null;
    if (dedupe && dedupe[1]) {
      const idCol = headers.indexOf(dedupe[0]) + 1;
      if (idCol > 0 && sheet.getLastRow() > 1) {
        const ids = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1).getValues();
        for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(dedupe[1])) return ContentService.createTextOutput("duplicate");
      }
    }

    if (name === "Call Quiz Leads") data.booked = "No";
    const row = headers.map(function (h) {
      if (h === "Status") return "New";
      const field = map[h];
      return field ? display(field, data[field]) : "";
    });
    const next = sheet.getLastRow() + 1;
    if (next > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 500);
    sheet.getRange(next, 1, 1, row.length).setValues([row]);
    if (name === "Booked Calls") markQuizBooked(book, data);
    // Optional: email yourself every lead
    // MailApp.sendEmail("you@example.com", "New lead: " + data.name, JSON.stringify(data, null, 2));
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}
