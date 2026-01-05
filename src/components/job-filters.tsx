"use client";

// src/components/job-filters.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { SlidersHorizontal } from "lucide-react"
import { useState, useEffect } from "react"
import type { JobType } from "@/types/app"

interface JobFiltersProps {
  onChange: (filters: {
    search: string
    location: string
    type: JobType[]
    remote: boolean
    hybrid: boolean
  }) => void
}

const jobTypes: JobType[] = ['full-time', 'part-time', 'contract', 'internship']

const FiltersContent = ({
  search, setSearch,
  location, setLocation,
  selectedTypes, handleTypeChange,
  remote, setRemote,
  hybrid, setHybrid
}: {
  search: string, setSearch: (v: string) => void,
  location: string, setLocation: (v: string) => void,
  selectedTypes: JobType[], handleTypeChange: (t: JobType, c: boolean) => void,
  remote: boolean, setRemote: (v: boolean) => void,
  hybrid: boolean, setHybrid: (v: boolean) => void
}) => (
  <div className="space-y-7">
    {/* Search */}
    <div>
      <Label htmlFor="search">Job title or keyword</Label>
      <Input
        id="search"
        placeholder="Software Engineer, Marketing..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-2"
      />
    </div>

    {/* Location */}
    <div>
      <Label htmlFor="location">Location</Label>
      <Input
        id="location"
        placeholder="Cairo, Alexandria, Remote..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="mt-2"
      />
    </div>

    {/* Job Type */}
    <div className="space-y-3">
      <Label>Job Type</Label>
      {jobTypes.map((type) => (
        <div key={type} className="flex items-center space-x-3">
          <Checkbox
            id={type}
            checked={selectedTypes.includes(type)}
            onCheckedChange={(checked) => handleTypeChange(type, checked as boolean)}
          />
          <label htmlFor={type} className="text-sm font-medium capitalize cursor-pointer">
            {type.replace('-', ' ')}
          </label>
        </div>
      ))}
    </div>

    {/* Work Location */}
    <div className="space-y-3 pt-4 border-t">
      <Label>Work Location</Label>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="remote"
            checked={remote}
            onCheckedChange={(checked) => setRemote(checked as boolean)}
          />
          <label htmlFor="remote" className="text-sm font-medium cursor-pointer">
            Remote only
          </label>
        </div>
        <div className="flex items-center space-x-3">
          <Checkbox
            id="hybrid"
            checked={hybrid}
            onCheckedChange={(checked) => setHybrid(checked as boolean)}
          />
          <label htmlFor="hybrid" className="text-sm font-medium cursor-pointer">
            Hybrid
          </label>
        </div>
      </div>
    </div>
  </div>
)

export function JobFilters({ onChange }: JobFiltersProps) {
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([])
  const [remote, setRemote] = useState(false)
  const [hybrid, setHybrid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    onChange({
      search: search.trim(),
      location: location.trim(),
      type: selectedTypes,
      remote,
      hybrid,
    })
  }, [search, location, selectedTypes, remote, hybrid, onChange])

  const handleTypeChange = (type: JobType, checked: boolean) => {
    if (checked) {
      setSelectedTypes(prev => [...prev, type])
    } else {
      setSelectedTypes(prev => prev.filter(t => t !== type))
    }
  }

  const props = {
      search, setSearch,
      location, setLocation,
      selectedTypes, handleTypeChange,
      remote, setRemote,
      hybrid, setHybrid
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 pr-8">
        <h3 className="text-lg font-semibold mb-6">Filters</h3>
        <FiltersContent {...props} />
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden w-full mb-6">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {(selectedTypes.length > 0 || remote || hybrid || search || location) && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {selectedTypes.length + (remote ? 1 : 0) + (hybrid ? 1 : 0) + (search ? 1 : 0) + (location ? 1 : 0)}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FiltersContent {...props} />
          </div>
          <SheetFooter className="mt-8">
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => {
                setSearch("");
                setLocation("");
                setSelectedTypes([]);
                setRemote(false);
                setHybrid(false);
              }}>Reset</Button>
              <Button type="button" onClick={() => setOpen(false)}>Apply</Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}