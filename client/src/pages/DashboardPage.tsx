import { useEffect, useState } from "react";
import API from "../services/api";
import type { Lead } from "../types/lead";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";
import { CSVLink } from "react-csv";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";

const DashboardPage = () => {

  const [leads, setLeads] =
    useState<Lead[]>([]);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [source, setSource] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const navigate = useNavigate();

  // SAFER USER INFO
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo") || "{}"
  );

  const role = userInfo?.role;

  const [darkMode, setDarkMode] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [debouncedSearch] =
    useDebounce(search, 500);

  const [filterStatus, setFilterStatus] =
    useState("");

  const [filterSource, setFilterSource] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pages, setPages] =
    useState(1);

  const [editingLead, setEditingLead] =
    useState<Lead | null>(null);

  const [editName, setEditName] =
    useState("");

  const [editEmail, setEditEmail] =
    useState("");

  const [editStatus, setEditStatus] =
    useState("");

  const [editSource, setEditSource] =
    useState("");

  // STATS
  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status === "New"
  ).length;

  const qualifiedLeads = leads.filter(
    (lead) => lead.status === "Qualified"
  ).length;

  const chartData = [
    {
      name: "New",
      value: newLeads
    },
    {
      name: "Qualified",
      value: qualifiedLeads
    }
  ];

  const sourceData = [
    {
      source: "Instagram",
      count: leads.filter(
        (lead) =>
          lead.source === "Instagram"
      ).length
    },

    {
      source: "Facebook",
      count: leads.filter(
        (lead) =>
          lead.source === "Facebook"
      ).length
    },

    {
      source: "Linkedin",
      count: leads.filter(
        (lead) =>
          lead.source === "Linkedin"
      ).length
    }
  ];

  // CREATE LEAD
  const createLead = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (
      !name ||
      !email ||
      !status ||
      !source
    ) {

      return toast.error(
        "All fields required"
      );

    }

    try {

      setLoading(true);

      const config = {

        headers: {

          Authorization:
            `Bearer ${userInfo.token}`

        }

      };

      await API.post(
        "/leads",
        {
          name,
          email,
          status,
          source
        },
        config
      );

      toast.success(
        "Lead created"
      );

      fetchLeads();

      setName("");
      setEmail("");
      setStatus("");
      setSource("");

    } catch {

      toast.error(
        "Failed to create lead"
      );

    } finally {

      setLoading(false);

    }

  };

  // LOGOUT
  const logoutHandler = () => {

    localStorage.removeItem(
      "userInfo"
    );

    navigate("/");

  };

  // FETCH LEADS
  const fetchLeads = async () => {

    try {

      setLoading(true);

      setError("");

      const config = {

        headers: {

          Authorization:
            `Bearer ${userInfo.token}`

        }

      };

      const res = await API.get(
        `/leads?page=${page}&search=${debouncedSearch}&status=${filterStatus}&source=${filterSource}`,
        config
      );

      setLeads(res.data.leads);

      setPages(res.data.pages);

    } catch {

      setError(
        "Failed to fetch leads"
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchLeads();

  }, [
    page,
    debouncedSearch,
    filterStatus,
    filterSource
  ]);

  // OPEN EDIT MODAL
  const openEditModal = (
    lead: Lead
  ) => {

    setEditingLead(lead);

    setEditName(lead.name);

    setEditEmail(lead.email);

    setEditStatus(lead.status);

    setEditSource(lead.source);

  };

  // DELETE LEAD
  const deleteLead = async (
    id: string
  ) => {

    try {

      const config = {

        headers: {

          Authorization:
            `Bearer ${userInfo.token}`

        }

      };

      await API.delete(
        `/leads/${id}`,
        config
      );

      toast.success(
        "Lead deleted"
      );

      fetchLeads();

    } catch {

      toast.error(
        "Delete failed"
      );

    }

  };

  // UPDATE LEAD
  const updateLead = async () => {

    try {

      const config = {

        headers: {

          Authorization:
            `Bearer ${userInfo.token}`

        }

      };

      await API.put(

        `/leads/${editingLead?._id}`,

        {
          name: editName,
          email: editEmail,
          status: editStatus,
          source: editSource
        },

        config

      );

      toast.success(
        "Lead updated"
      );

      setEditingLead(null);

      fetchLeads();

    } catch {

      toast.error(
        "Update failed"
      );

    }

  };

  return (

    <div
      className={`min-h-screen p-12 transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-4xl font-bold">
          Leads Dashboard
        </h1>

        <div className="flex gap-4">

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="bg-gray-700 text-white px-5 py-2 rounded-xl"
          >
            {darkMode ? "Light" : "Dark"}
          </button>

          <button
            onClick={logoutHandler}
            className="bg-red-500 text-white px-5 py-2 rounded-xl"
          >
            Logout
          </button>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className={`p-6 rounded-2xl shadow-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>

          <h2 className="text-lg font-semibold">
            Total Leads
          </h2>

          <p className="text-4xl font-bold mt-2">
            {totalLeads}
          </p>

        </div>

        <div className={`p-6 rounded-2xl shadow-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>

          <h2 className="text-lg font-semibold">
            New Leads
          </h2>

          <p className="text-4xl font-bold mt-2">
            {newLeads}
          </p>

        </div>

        <div className={`p-6 rounded-2xl shadow-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>

          <h2 className="text-lg font-semibold">
            Qualified Leads
          </h2>

          <p className="text-4xl font-bold mt-2">
            {qualifiedLeads}
          </p>

        </div>

      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

        <div className={`p-6 rounded-2xl shadow-md h-[350px] ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>

          <h2 className="text-2xl font-bold mb-4">
            Lead Status
          </h2>

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                outerRadius={100}
                label
              >

                <Cell fill="#3b82f6" />
                <Cell fill="#22c55e" />

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        <div className={`p-6 rounded-2xl shadow-md h-[350px] ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>

          <h2 className="text-2xl font-bold mb-4">
            Lead Sources
          </h2>

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart data={sourceData}>

              <XAxis dataKey="source" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="count"
                fill="#8b5cf6"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>
      {/* SEARCH + FILTERS */}
      <div className="mb-6">

  <CSVLink
    data={leads}
    filename="gigflow-leads.csv"
    className="bg-green-500 text-white px-5 py-3 rounded-xl"
  >
    Export CSV
  </CSVLink>

</div>

<div className="flex flex-wrap gap-4 mb-6">

  <input
    type="text"
    placeholder="Search..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className={`px-4 py-3 rounded-xl border flex-1 ${
      darkMode
        ? "bg-gray-700 border-gray-600 text-white"
        : "bg-white border-gray-300"
    }`}
  />

  <select
    value={filterStatus}
    onChange={(e) =>
      setFilterStatus(
        e.target.value
      )
    }
    className={`px-4 py-3 rounded-xl border ${
      darkMode
        ? "bg-gray-700 border-gray-600 text-white"
        : "bg-white border-gray-300"
    }`}
  >

    <option value="">
      All Status
    </option>

    <option value="New">
      New
    </option>

    <option value="Qualified">
      Qualified
    </option>

  </select>

  <select
    value={filterSource}
    onChange={(e) =>
      setFilterSource(
        e.target.value
      )
    }
    className={`px-4 py-3 rounded-xl border ${
      darkMode
        ? "bg-gray-700 border-gray-600 text-white"
        : "bg-white border-gray-300"
    }`}
  >

    <option value="">
      All Sources
    </option>

    <option value="Instagram">
      Instagram
    </option>

    <option value="Facebook">
      Facebook
    </option>

    <option value="Linkedin">
      Linkedin
    </option>

  </select>

</div>

{/* CREATE LEAD FORM */}

<form
  onSubmit={createLead}
  className={`${
    darkMode
      ? "bg-gray-800"
      : "bg-white"
  } p-4 rounded-2xl shadow-md mb-8 flex flex-wrap gap-4`}
>

  <input
    type="text"
    placeholder="Name"
    value={name}
    onChange={(e) =>
      setName(e.target.value)
    }
    className={`px-4 py-3 rounded-xl flex-1 min-w-[180px] border ${
      darkMode
        ? "bg-gray-700 border-gray-600 text-white"
        : "bg-white border-gray-300"
    }`}
  />

  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) =>
      setEmail(e.target.value)
    }
    className={`px-4 py-3 rounded-xl flex-1 min-w-[220px] border ${
      darkMode
        ? "bg-gray-700 border-gray-600 text-white"
        : "bg-white border-gray-300"
    }`}
  />

  <select
    value={status}
    onChange={(e) =>
      setStatus(e.target.value)
    }
    className={`px-4 py-3 rounded-xl border ${
      darkMode
        ? "bg-gray-700 border-gray-600 text-white"
        : "bg-white border-gray-300"
    }`}
  >

    <option value="">
      Status
    </option>

    <option value="New">
      New
    </option>

    <option value="Qualified">
      Qualified
    </option>

  </select>

  <select
    value={source}
    onChange={(e) =>
      setSource(e.target.value)
    }
    className={`px-4 py-3 rounded-xl border ${
      darkMode
        ? "bg-gray-700 border-gray-600 text-white"
        : "bg-white border-gray-300"
    }`}
  >

    <option value="">
      Source
    </option>

    <option value="Instagram">
      Instagram
    </option>

    <option value="Facebook">
      Facebook
    </option>

    <option value="Linkedin">
      Linkedin
    </option>

  </select>

  <button
    disabled={loading}
    className="bg-black text-white px-6 py-3 rounded-xl disabled:bg-gray-500"
  >
    {loading ? "Adding..." : "Add Lead"}
  </button>

</form>

{/* LOADING + ERROR */}

{loading && (
  <p>Loading...</p>
)}

{error && (
  <p className="text-red-500">
    {error}
  </p>
)}

{/* LEADS */}

<div className="space-y-4">

  {leads.map((lead) => (

    <div
      key={lead._id}
      className={`p-4 rounded-xl border ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-300"
      }`}
    >

      <h2 className="text-xl font-bold">
        {lead.name}
      </h2>

      <p>{lead.email}</p>

      <p>{lead.status}</p>

      <p>{lead.source}</p>

      {role === "Admin" && (

        <div className="flex gap-3 mt-3">

          <button
            onClick={() =>
              openEditModal(lead)
            }
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Edit
          </button>

          <button
            onClick={() => {

              const confirmDelete =
                window.confirm(
                  "Delete this lead?"
                );

              if (confirmDelete) {
                deleteLead(lead._id);
              }

            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>

        </div>

      )}

    </div>

  ))}

</div>

{/* PAGINATION */}

<div className="flex justify-center gap-4 mt-8">

  <button
    disabled={page === 1}
    onClick={() =>
      setPage(page - 1)
    }
    className="bg-black text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
  >
    Prev
  </button>

  <span className="text-lg font-bold">
    {page} / {pages}
  </span>

  <button
    disabled={page === pages}
    onClick={() =>
      setPage(page + 1)
    }
    className="bg-black text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
  >
    Next
  </button>

</div>

{/* EDIT MODAL */}

{editingLead && (

  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div
      className={`p-8 rounded-2xl w-full max-w-lg ${
        darkMode
          ? "bg-gray-900"
          : "bg-white"
      }`}
    >

      <h2 className="text-3xl font-bold mb-6">
        Edit Lead
      </h2>

      <div className="space-y-4">

        <input
          type="text"
          value={editName}
          onChange={(e) =>
            setEditName(e.target.value)
          }
          className="w-full border px-4 py-3 rounded-xl text-black"
        />

        <input
          type="email"
          value={editEmail}
          onChange={(e) =>
            setEditEmail(e.target.value)
          }
          className="w-full border px-4 py-3 rounded-xl text-black"
        />

        <select
          value={editStatus}
          onChange={(e) =>
            setEditStatus(e.target.value)
          }
          className="w-full border px-4 py-3 rounded-xl text-black"
        >

          <option value="New">
            New
          </option>

          <option value="Qualified">
            Qualified
          </option>

        </select>

        <select
          value={editSource}
          onChange={(e) =>
            setEditSource(e.target.value)
          }
          className="w-full border px-4 py-3 rounded-xl text-black"
        >

          <option value="Instagram">
            Instagram
          </option>

          <option value="Facebook">
            Facebook
          </option>

          <option value="Linkedin">
            Linkedin
          </option>

        </select>

      </div>

      <div className="flex gap-4 mt-6">

        <button
          onClick={updateLead}
          className="bg-green-500 text-white px-5 py-3 rounded-xl"
        >
          Save
        </button>

        <button
          onClick={() =>
            setEditingLead(null)
          }
          className="bg-gray-500 text-white px-5 py-3 rounded-xl"
        >
          Cancel
        </button>

      </div>

    </div>

  </div>

)}

    </div>

  );

};

export default DashboardPage;