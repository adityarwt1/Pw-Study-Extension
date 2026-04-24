import { getAcitveWindow } from "../utils/chromeApis/getCurrentAcitivewindow";
import { excuteScript } from "../utils/chromeApis/runScriptOn";

const TimeTravel = () => {
  const handleTimeTravel = async () => {
    const response = await getAcitveWindow();
    if (!response || !response.id) {
      console.error("No active window/tab found");
      return;
    }

    await excuteScript(response.id, () => {
      console.log("Original:", new Date());

      // Save the real Date
      const OriginalDate = Date;

      // Override Date - this version avoids the spread error completely
      (Date as any) = class extends OriginalDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            // Fake fixed date
            super("2026-04-28T20:30:00");
          } else {
            // Pass arguments without spread (safest for Date constructor)
            if (args.length === 1) {
              super(args[0]);
            } else if (args.length === 3) {
              super(args[0], args[1], args[2]); // year, month, day
            } else if (args.length === 7) {
              super(
                args[0],
                args[1],
                args[2],
                args[3],
                args[4],
                args[5],
                args[6],
              );
            } else {
            //   super(...(args)); `// fallback (rare case)
            }
          }
        }

        static now() {
          return new OriginalDate("2026-04-28T20:30:00").getTime();
        }
      };

      // Test it
      console.log("Fake new Date():", new Date());
      console.log("Fake Date.now():", Date.now());
      console.log("Real OriginalDate():", new OriginalDate());
    });
  };

  return (
    <button onClick={handleTimeTravel}>
      Time Travel (Set Date to 2026-04-28)
    </button>
  );
};

export default TimeTravel;
