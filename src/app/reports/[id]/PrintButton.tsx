"use client";

export default function PrintButton() {
  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };
  return (
    <div className="pt-2 print:hidden">
      <button
        type="button"
        onClick={onPrint}
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Print Report
      </button>
    </div>
  );
}
