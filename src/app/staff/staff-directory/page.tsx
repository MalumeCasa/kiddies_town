"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Search, Plus, Edit2, Trash2, Mail, Phone, Calendar, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { StaffForm } from "../components/staff-form"

interface Staff {
  id: string
  name: string
  email: string
  position: string
  department: string
  joinDate: string
  phone: string
}

const INITIAL_STAFF: Staff[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@school.edu",
    position: "Principal",
    department: "Administration",
    joinDate: "2015-01-15",
    phone: "555-0001",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@school.edu",
    position: "Math Teacher",
    department: "Science & Mathematics",
    joinDate: "2018-08-20",
    phone: "555-0002",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@school.edu",
    position: "English Teacher",
    department: "Languages",
    joinDate: "2019-09-01",
    phone: "555-0003",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@school.edu",
    position: "Counselor",
    department: "Student Services",
    joinDate: "2020-02-10",
    phone: "555-0004",
  },
  {
    id: "5",
    name: "Robert Wilson",
    email: "robert.wilson@school.edu",
    position: "PE Teacher",
    department: "Physical Education",
    joinDate: "2017-06-15",
    phone: "555-0005",
  },
]

export default function StaffDirectory() {
  const [staff, setStaff] = useState<Staff[]>(INITIAL_STAFF)
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const filteredStaff = useMemo(
    () =>
      staff.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase()) ||
          s.position.toLowerCase().includes(search.toLowerCase()) ||
          s.department.toLowerCase().includes(search.toLowerCase()),
      ),
    [staff, search],
  )

  const handleDelete = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id))
  }

  const handleSave = (data: Omit<Staff, "id">) => {
    if (editingId) {
      setStaff(staff.map((s) => (s.id === editingId ? { ...data, id: editingId } : s)))
      setEditingId(null)
    } else {
      const newStaff: Staff = {
        ...data,
        id: Date.now().toString(),
      }
      setStaff([...staff, newStaff])
    }
    setShowForm(false)
  }

  const editingStaff = editingId ? staff.find((s) => s.id === editingId) : undefined

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="hover:bg-slate-100 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Staff Directory</h1>
              <p className="text-slate-600 mt-1">{staff.length} staff members registered</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="mb-8 p-6 bg-white border border-slate-200">
            <StaffForm
              initialData={editingStaff}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false)
                setEditingId(null)
              }}
            />
          </Card>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by name, email, position, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 h-11"
            />
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <Card
              key={member.id}
              className="bg-white border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300"
            >
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                <p className="text-sm font-semibold text-blue-600 mt-1">{member.position}</p>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 uppercase">Department</p>
                    <p className="text-slate-700">{member.department}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 uppercase">Email</p>
                    <p className="text-slate-700 truncate">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 uppercase">Phone</p>
                    <p className="text-slate-700">{member.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 uppercase">Join Date</p>
                    <p className="text-slate-700">{new Date(member.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingId(member.id)
                    setShowForm(true)
                  }}
                  className="flex-1 border-slate-200 hover:bg-slate-50"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(member.id)}
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <Card className="bg-white border border-slate-200 p-12 text-center">
            <p className="text-slate-600">No staff members found. Try adjusting your search.</p>
          </Card>
        )}
      </div>
    </main>
  )
}
