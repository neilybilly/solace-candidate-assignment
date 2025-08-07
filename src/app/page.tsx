"use client";

import { useEffect, useState } from "react";

interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    console.log("fetching advocates...");
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search: searchTerm.trim(),
    });
    fetch(`/api/advocates?${params.toString()}`).then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setTotalPages(jsonResponse.pagination.totalPages)
      });
    });
  }, [page, limit, debouncedTerm]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const resetSearch = () => {
    console.log(advocates);
    setSearchTerm('')
  };

  const formatPhoneNumber = (phone: number) => {  
    const digits = String(phone)

    const areaCode = digits.slice(0, 3);
    const centralOffice = digits.slice(3, 6);
    const lineNumber = digits.slice(6);
  
    return `(${areaCode}) ${centralOffice}-${lineNumber}`;
  }

  return (
    <main style={{ margin: "24px" }}>
      <h1 className="text-4xl text-center font-bold text-[#1d4339]">Solace Advocates</h1>
      <div className="mb-4 max-w-md">
        <p className="text-sm font-semibold text-gray-700 mb-1">Search</p>
        <div className="flex gap-2 mb-1">
          <input
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onChange={onChange}
            value={searchTerm}
            placeholder="Type to search..."
          />
          <button
            onClick={resetSearch}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded-md font-medium"
          >
            Reset
          </button>
        </div>       
        <p className="text-xs text-gray-500">
          Searching for: <span className="font-semibold text-gray-700">{searchTerm || 'None'}</span>
        </p>
      </div>
      <div className="rounded-xl border overflow-hidden">
      <table className="w-full text-left table-auto min-w-max">
        <thead>
          <tr>
            <th className="p-4 border-b bg-gray-100">First Name</th>
            <th className="p-4 border-b bg-gray-100">Last Name</th>
            <th className="p-4 border-b bg-gray-100">City</th>
            <th className="p-4 border-b bg-gray-100">Degree</th>
            <th className="p-4 border-b bg-gray-100">Specialties</th>
            <th className="p-4 border-b bg-gray-100">Years of Experience</th>
            <th className="p-4 border-b bg-gray-100">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {advocates.map((advocate) => {
            return (
              <tr key={advocate.id}>
                <td className="p-4 border-b">{advocate.firstName}</td>
                <td className="p-4 border-b">{advocate.lastName}</td>
                <td className="p-4 border-b">{advocate.city}</td>
                <td className="p-4 border-b">{advocate.degree}</td>
                <td className="p-4 border-b">
                  {advocate.specialties.map((s, i) => (
                    <div key={`${s}-${i}`}>{s}</div>
                  ))}
                </td>
                <td className="p-4 border-b">{advocate.yearsOfExperience}</td>
                <td className="p-4 border-b">{formatPhoneNumber(advocate.phoneNumber)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      <div className="flex items-center justify-center space-x-4 mt-4">
        <button
          onClick={() => setPage((page) => Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Previous
        </button>

        <span className="text-sm font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((page) => Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </main>
  );
}

