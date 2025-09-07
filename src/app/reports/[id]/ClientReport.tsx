"use client";

import React from "react";

type ClientScore = { indicator: string; score: number };
type ClientStudent = {
    name: string;
    grade: number | string;
    classGroup: string;
    date: string;
    teacher: string;
    evaluationType: string;
};

export type ClientReportProps = {
    student: ClientStudent;
    scores: ClientScore[];
    comments: string;
};

// Header Component
const ReportHeader: React.FC = () => (
    <header className="flex flex-col items-center justify-center pb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo_mekun_academy.png" alt="Mekun Academy Logo" className="h-16 w-auto mb-2" />
        <h1 className="text-xl font-bold">Mekun Academy</h1>
        <p className="text-sm text-gray-600">Student Progress Report</p>
    </header>
);

// Student Info Component
const StudentInfo: React.FC<{ studentData: ClientStudent }> = ({ studentData }) => (
    <div className="py-6">
        <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-base">
            <div className="flex">
                <span className="font-bold text-gray-700 w-40">Student Name:</span>
                <span className="text-gray-800">{studentData.name}</span>
            </div>
            <div className="flex">
                <span className="font-bold text-gray-700 w-40">Grade Level:</span>
                <span className="text-gray-800">{studentData.grade}</span>
            </div>
            <div className="flex">
                <span className="font-bold text-gray-700 w-40">Class/Group:</span>
                <span className="text-gray-800">{studentData.classGroup}</span>
            </div>
            <div className="flex">
                <span className="font-bold text-gray-700 w-40">Date of Evaluation:</span>
                <span className="text-gray-800">{studentData.date}</span>
            </div>
            <div className="flex col-span-2">
                <span className="font-bold text-gray-700 w-40">Teacher&apos;s Name:</span>
                <span className="text-gray-800">{studentData.teacher}</span>
            </div>
        </div>
    </div>
);

// Scores Table Component
const ScoresTable: React.FC<{ scores: ClientScore[] }> = ({ scores }) => {
    const totalScore = scores.reduce((acc, item) => acc + item.score, 0);

    return (
        <div className="w-full mt-2">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b-2 border-gray-400">
                        <th className="py-2 text-lg font-semibold text-gray-700">Indicator</th>
                        <th className="py-2 text-lg font-semibold text-gray-700 text-right pr-5">Score (Out of 10)</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="py-2 text-gray-600">{item.indicator}</td>
                            <td className="py-2 text-gray-800 text-right pr-5">{item.score} / 10</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="border-t-4 border-black font-bold">
                        <td className="py-3 text-lg">Total</td>
                        <td className="py-3 text-lg text-right pr-5">{totalScore} / 100</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

// Comments Component
const OverallComments: React.FC<{ comments: string }> = ({ comments }) => (
    <div className="mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-1">Overall Comments:</h3>
        <div className="p-3 mt-1 border-2 border-gray-600 rounded-md text-gray-700 bg-white min-h-[100px]">
            {comments}
        </div>
    </div>
);

const PrintButton: React.FC = () => (
    <div className="no-print w-full max-w-4xl flex justify-end mb-4">
        <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
        >
            Print Report
        </button>
    </div>
);

export default function ClientReport({ student, scores, comments }: ClientReportProps) {
    return (
        <>
            {/* Print-specific styles */}
            <style>{`
                @media print {
            @page { size: A4 portrait; margin: 10mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .no-print { display: none !important; }
            /* Remove outer padding/background to avoid overflow */
            .report-print-wrap { background: white !important; min-height: auto !important; padding: 0 !important; }
            /* Fit content within one page */
            .print-container { box-shadow: none !important; border: none !important; padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
            #report-card { font-size: 0.9rem; }
            #report-card h1, #report-card h2, #report-card h3 { margin: 4px 0 !important; }
            #report-card table th, #report-card table td { padding-top: 4px !important; padding-bottom: 4px !important; }
                }
            `}</style>

        <div className="report-print-wrap bg-gray-100 min-h-screen p-4 sm:p-8 flex flex-col items-center font-sans">
                <PrintButton />

                <main id="report-card" className="print-container bg-white p-10 rounded-lg shadow-xl w-full max-w-4xl border">
                    <ReportHeader />
                    <StudentInfo studentData={student} />
                    <ScoresTable scores={scores} />
                    <OverallComments comments={comments} />
                </main>
            </div>
        </>
    );
}

