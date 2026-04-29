import { getAcitveWindow } from "../utils/chromeApis/getCurrentAcitivewindow";
import { excuteScript } from "../utils/chromeApis/runScriptOn";

const TimeTravel = () => {
  const handleTimeTravel2 = () => {
    // Save original Date
    const OriginalDate = Date;
     const changeDate = new Date(
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
    // Override Date constructor - local version
    (Date as any) = class extends OriginalDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
          // Set a specific date when new Date() is called
          super(changeDate);
        } else {
          if (args.length === 1) {
            super(args[0]);
          } else if (args.length === 3) {
            super(args[0], args[1], args[2]);
          } else if (args.length === 7) {
            super(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
          }
        }
      }

      static now() {
        // Override Date.now()
        return new OriginalDate(changeDate).getTime();
      }
    };

    // Now any new Date() calls will return your custom time
    console.log("Time Travel v2 activated:", new Date());
  };
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
      const changeDate = new Date(
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      // Override Date - this version avoids the spread error completely
      (Date as any) = class extends OriginalDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            // Fake fixed date
            super(changeDate);
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
          return new OriginalDate(changeDate).getTime();
        }
      };

      // Test it
      console.log("Fake new Date():", new Date());
      console.log("Fake Date.now():", Date.now());
      console.log("Real OriginalDate():", new OriginalDate());
    });
  };

  return (
    <div>
      <button onClick={handleTimeTravel}>Time Travel (Window)</button>
      <button onClick={handleTimeTravel2}>Time Travel v2 (Local)</button>
    </div>
  );
};

export default TimeTravel;
