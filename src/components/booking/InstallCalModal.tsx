import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { INSTALL_BOOKING } from "@/config/site";
import { track } from "@/lib/track";

export function InstallCalModal({
  open,
  onOpenChange,
  note = "service-page",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: string;
}) {
  const [calLoaded, setCalLoaded] = useState(false);

  useEffect(() => {
    if (!open) return;
    track("booking_open", { source: `${note} — native cal embed` });

    (async function () {
      try {
        const cal = await getCalApi({ namespace: INSTALL_BOOKING.namespace });
        cal("ui", {
          theme: "dark",
          cssVarsPerTheme: { dark: { "cal-brand": "#00cfff" }, light: { "cal-brand": "#00cfff" } },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
        setCalLoaded(true);
      } catch (err) {
        console.error("Failed to load Cal API", err);
        setCalLoaded(true);
      }
    })();
  }, [open, note]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 flex h-[90vh] max-h-[850px] w-[95vw] max-w-[1000px] translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-border bg-card shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-turbo/15 text-turbo">
                <CalendarIcon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <Dialog.Title className="text-base font-bold text-foreground sm:text-lg">
                  Book Your Setup & Installation Date
                </Dialog.Title>
                <Dialog.Description className="text-xs text-muted-foreground sm:text-sm">
                  Pick a day and time that works for you. Flat-rate labor confirmed before we start.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <X className="h-5 w-5" aria-hidden />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          <div className="relative flex-1 overflow-hidden p-2 sm:p-4">
            {!calLoaded && (
              <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-turbo" />
                Loading booking calendar...
              </div>
            )}
            <Cal
              namespace={INSTALL_BOOKING.namespace}
              calLink={INSTALL_BOOKING.calLink}
              style={{ width: "100%", height: "100%", overflow: "auto" }}
              config={{
                layout: "month_view",
                useSlotsViewOnSmallScreen: "true",
                theme: "dark",
              }}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
