import { useState } from "react";

interface TableInterface {
  n: number;
  t2: number;
  t4: number;
  t6: number;
}

const MultiplicationTables = () => {
  const [show1to10, setShow1to10] = useState<boolean>(false);
  const [show11to20, setShow11to20] = useState<boolean>(false);

  const data1to10: TableInterface[] = [
    { n: 1, t2: 2, t4: 4, t6: 6 },
    { n: 2, t2: 4, t4: 8, t6: 12 },
    { n: 3, t2: 6, t4: 12, t6: 18 },
    { n: 4, t2: 8, t4: 16, t6: 24 },
    { n: 5, t2: 10, t4: 20, t6: 30 },
    { n: 6, t2: 12, t4: 24, t6: 36 },
    { n: 7, t2: 14, t4: 28, t6: 42 },
    { n: 8, t2: 16, t4: 32, t6: 48 },
    { n: 9, t2: 18, t4: 36, t6: 54 },
    { n: 10, t2: 20, t4: 40, t6: 60 },
  ];

  const data11to20: TableInterface[] = [
    { n: 11, t2: 22, t4: 44, t6: 66 },
    { n: 12, t2: 24, t4: 48, t6: 72 },
    { n: 13, t2: 26, t4: 52, t6: 78 },
    { n: 14, t2: 28, t4: 56, t6: 84 },
    { n: 15, t2: 30, t4: 60, t6: 90 },
    { n: 16, t2: 32, t4: 64, t6: 96 },
    { n: 17, t2: 34, t4: 68, t6: 102 },
    { n: 18, t2: 36, t4: 72, t6: 108 },
    { n: 19, t2: 38, t4: 76, t6: 114 },
    { n: 20, t2: 40, t4: 80, t6: 120 },
  ];

  const Table = ({ title, data }: { title: string; data: TableInterface[] }) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-400 text-center text-lg">
          <thead>
            <tr className="bg-gray-200 font-bold">
              <th className="border border-gray-400 px-8 py-4">Number</th>
              <th className="border border-gray-400 px-8 py-4">Table of 2</th>
              <th className="border border-gray-400 px-8 py-4">Table of 4</th>
              <th className="border border-gray-400 px-8 py-4">Table of 6</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-400 px-8 py-4 font-medium">{row.n}</td>
                <td className="border border-gray-400 px-8 py-4">{row.t2}</td>
                <td className="border border-gray-400 px-8 py-4">{row.t4}</td>
                <td className="border border-gray-400 px-8 py-4">{row.t6}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
    
      {/* Buttons */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setShow1to10(!show1to10)}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          {show1to10 ? "Hide 1 to 10" : "Show 1 to 10"}
        </button>

        <button
          onClick={() => setShow11to20(!show11to20)}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          {show11to20 ? "Hide 11 to 20" : "Show 11 to 20"}
        </button>
      </div>

      {/* Tables */}
      <div>
        {show1to10 && <Table title="1 to 10" data={data1to10} />}
        {show11to20 && <Table title="11 to 20" data={data11to20} />}
      </div>
    </div>
  );
};

export default MultiplicationTables;