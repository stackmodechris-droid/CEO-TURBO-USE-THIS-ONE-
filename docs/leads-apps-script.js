// Paste into the "FREE Lead Magnet Leads" sheet: Extensions → Apps Script (replace everything).
// Receives every lead from ceoturbo.com (/api/audit, /api/cal-webhook, /api/lead) and files it on
// the right tab, under the matching column header. Columns can be reordered or hidden in the
// sheet: rows are matched by header NAME, not position. Setup steps: docs/leads-google-sheet.md

const SECRET = "PASTE_YOUR_LEADS_WEBHOOK_SECRET_HERE"; // same value as LEADS_WEBHOOK_SECRET in Vercel

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
  "Landing page": "landing",
};

const TABS = {
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
      "Call time": "startTime",
      Event: "event",
      Notes: "notes",
      "Booked from": "source",
      "Booking ID": "uid",
    },
    ATTR,
    { "Form page": "page" }
  ),
  "Card Orders": Object.assign(
    {
      Received: "receivedAt",
      Name: "name",
      Phone: "phone",
      Email: "email",
      Company: "business",
      Product: "product",
      Style: "style",
      Pack: "pack",
      Total: "total",
      Note: "note",
    },
    ATTR,
    { "Form page": "page" }
  ),
};

const TYPE_LABEL = { "audit-business": "Business", "audit-artist": "Artist" };

function tabFor(type) {
  if (type === "booking") return "Booked Calls";
  if (String(type).indexOf("audit") === 0) return "Free Check Leads";
  return "Card Orders";
}

function display(field, value) {
  if (value === undefined || value === null || value === "") return "";
  // The site prefixes "'" to values starting with = + - @ so they can't run as formulas. Phone cells
  // are plain text, so the prefix is not needed there (and would show).
  if (field === "phone") return String(value).replace(/^'(?=[=+\-@])/, "");
  if (field === "smsOptIn") return value === true || value === "true" ? "Yes" : "No";
  if (field === "type") return TYPE_LABEL[value] || value;
  if (field === "receivedAt" || field === "startTime") {
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
    const book = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = book.getSheetByName(name);
    if (!sheet) {
      sheet = book.insertSheet(name);
      const labels = Object.keys(map).concat(["Status", "Follow-up notes"]);
      sheet.getRange(1, 1, 1, labels.length).setValues([labels]).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    const lastCol = sheet.getLastColumn();
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // A booking is only recorded once, even if Cal.com retries the webhook.
    if (name === "Booked Calls" && data.uid) {
      const idCol = headers.indexOf("Booking ID") + 1;
      if (idCol > 0 && sheet.getLastRow() > 1) {
        const ids = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1).getValues();
        for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(data.uid)) return ContentService.createTextOutput("duplicate");
      }
    }

    const row = headers.map(function (h) {
      if (h === "Status") return "New";
      const field = map[h];
      return field ? display(field, data[field]) : "";
    });
    const next = sheet.getLastRow() + 1;
    if (next > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 500);
    sheet.getRange(next, 1, 1, row.length).setValues([row]);
    // Optional: email yourself every lead
    // MailApp.sendEmail("you@example.com", "New lead: " + data.name, JSON.stringify(data, null, 2));
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}
