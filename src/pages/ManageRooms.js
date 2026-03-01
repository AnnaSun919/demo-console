import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchRooms, fetchRoomById, createRoom, editRoom, deleteRoom } from "../actions/Rooms";
import { fetchGroups } from "../actions/Groups";

const ManageRooms = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { rooms, isLoading } = useSelector((state) => state.rooms);
  const { groups } = useSelector((state) => state.groups);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1 = basic info, 2 = timeslots
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    description: "",
    groupIds: [],
    isPublic: false,
    isOpen: true,
  });

  // Timeslot state: { Monday: { isOpen: true, startTime: "09:00", endTime: "18:00" }, ... }
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [timeslotSettings, setTimeslotSettings] = useState({});
  const [interval, setInterval] = useState(60); // in minutes

  useEffect(() => {
    dispatch(fetchRooms());
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleOpenModal = async (room = null) => {
    if (room) {
      const result = await dispatch(fetchRoomById(room.roomId));
      if (result.success) {
        const roomData = result.room;
        setEditingRoom(roomData);
        setFormData({
          name: roomData.name,
          capacity: roomData.capacity?.toString() || "",
          description: roomData.description || "",
          groupIds: roomData.groupIds || [],
          isPublic: roomData.isPublic === true,
          isOpen: roomData.status === "open",
        });

        // Populate timeslot settings from API response
        const settings = {};
        DAYS.forEach(day => {
          settings[day] = { isOpen: false, startTime: "09:00", endTime: "18:00" };
        });
        if (roomData.timeslots && roomData.timeslots.length > 0) {
          roomData.timeslots.forEach(slot => {
            if (slot.dayType && settings[slot.dayType]) {
              settings[slot.dayType] = {
                isOpen: true,
                startTime: slot.startTime || "09:00",
                endTime: slot.endTime || "18:00"
              };
            }
          });
        }
        setTimeslotSettings(settings);
        setInterval(roomData.intervalMins ? Number(roomData.intervalMins) : 60);
      }
    } else {
      setEditingRoom(null);
      setFormData({ name: "", capacity: "", description: "", groupIds: [], isPublic: false, isOpen: true });
      // Initialize timeslot settings for each day
      const initialSettings = {};
      DAYS.forEach(day => {
        initialSettings[day] = { isOpen: false, startTime: "09:00", endTime: "18:00" };
      });
      setTimeslotSettings(initialSettings);
      setInterval(60);
    }
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
    setCurrentStep(1);
  };

  // Timeslot functions
  const handleDayToggle = (day) => {
    setTimeslotSettings(prev => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day]?.isOpen }
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setTimeslotSettings(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleApplyToAll = () => {
    const firstOpenDay = DAYS.find(day => timeslotSettings[day]?.isOpen);
    if (firstOpenDay) {
      const { startTime, endTime } = timeslotSettings[firstOpenDay];
      const newSettings = {};
      DAYS.forEach(day => {
        newSettings[day] = { ...timeslotSettings[day], startTime, endTime };
      });
      setTimeslotSettings(newSettings);
    }
  };

  const handleApplyWorkingHours = () => {
    const newSettings = {};
    DAYS.forEach(day => {
      newSettings[day] = { isOpen: true, startTime: "09:00", endTime: "17:00" };
    });
    setTimeslotSettings(newSettings);
  };

  // Generate hours options (00:00 to 24:00)
  const HOURS_OPTIONS = Array.from({ length: 25 }, (_, i) =>
    `${i.toString().padStart(2, '0')}:00`
  );

  // Get group ID (handle both id and groupId)
  const getGroupId = (group) => group.groupId;

  // Add group from dropdown
  const handleAddGroup = (groupId) => {
    const id = Number(groupId);
    if (!id || formData.groupIds.includes(id)) return;
    setFormData((prev) => ({
      ...prev,
      groupIds: [...prev.groupIds, id],
      isPublic: false,
    }));
  };

  // Remove group from selected list
  const handleRemoveGroup = (groupId) => {
    setFormData((prev) => ({
      ...prev,
      groupIds: prev.groupIds.filter((id) => id !== groupId),
    }));
  };

  // Handle public toggle
  const handlePublicToggle = (checked) => {
    setFormData((prev) => ({
      ...prev,
      isPublic: checked,
      groupIds: checked ? [] : prev.groupIds, // Clear groups if public
    }));
  };

  // Get groups that are not yet selected (for dropdown)
  const availableGroups = groups.filter((group) => !formData.groupIds.includes(group.groupId));

  // Get selected group objects for display
  const selectedGroups = groups.filter((group) => formData.groupIds.includes(group.groupId));

  // Validation: must be public OR have at least one group selected
  const isAccessValid = formData.isPublic || formData.groupIds.length > 0;

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format timeslots for API
    const timeslots = [];
    DAYS.forEach(day => {
      const setting = timeslotSettings[day];
      if (setting?.isOpen) {
        timeslots.push({
          dayType: day,
          startTime: setting.startTime,
          endTime: setting.endTime
        });
      }
    });

    const submitData = {
      name: formData.name,
      description: formData.description,
      status: formData.isOpen ? "open" : "closed",
      capacity: formData.capacity,
      isPublic: formData.isPublic,
      groupIds: formData.groupIds,
      timeslots: timeslots,
      intervalMins: String(interval),
    };

    if (editingRoom) {
      const result = await dispatch(editRoom(editingRoom.roomId, submitData));
      if (result.success) handleCloseModal();
    } else {
      const result = await dispatch(createRoom(submitData));
      if (result.success) handleCloseModal();
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    dispatch(deleteRoom(roomId));
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Manage Rooms</CardTitle>
              <CardDescription>Add, edit, or remove meeting rooms</CardDescription>
            </div>
            <Button onClick={() => handleOpenModal()}>Add Room</Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Loading rooms...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Capacity</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room.id} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{room.name}</td>
                        <td className="p-3">{room.capacity} </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleOpenModal(room)}>Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteRoom(room.roomId)}>Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto py-6">
            <Card className={currentStep === 1 ? "w-[450px]" : "w-[900px] max-h-[90vh] overflow-auto"}>
              <CardHeader>
                <CardTitle>{editingRoom ? "Edit Room" : "Add Room"} - Step {currentStep} of 2</CardTitle>
                <CardDescription>
                  {currentStep === 1 ? "Basic Information" : "Available Timeslots"}
                </CardDescription>
              </CardHeader>

              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Room Name</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optional)</Label>
                      <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter room description..." />
                    </div>
                    <div className="flex items-center mt-4">
                      <div className="flex items-center gap-2 flex-1">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input id="capacity" type="number" min="1" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} required className="w-20 ml-2" />
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <Label>Status</Label>
                        <input
                          type="checkbox"
                          id="isOpen"
                          checked={formData.isOpen}
                          onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 ml-2"
                        />
                        <Label htmlFor="isOpen" className="cursor-pointer font-normal">
                          Open
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Access Settings</Label>

                      {/* Public checkbox - hide when groups are selected */}
                      {formData.groupIds.length === 0 && (
                        <div className="flex items-center gap-2 py-2 ml-2">
                          <input
                            type="checkbox"
                            id="isPublic"
                            checked={formData.isPublic}
                            onChange={(e) => handlePublicToggle(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          <Label htmlFor="isPublic" className="cursor-pointer font-normal">
                            Public Room (accessible to all users)
                          </Label>
                        </div>
                      )}

                      {/* Group selection - only show when not public */}
                      {!formData.isPublic && (
                        <>
                          {/* Selected groups as tags */}
                          {selectedGroups.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/30">
                              {selectedGroups.map((group) => (
                                <span
                                  key={group.groupId}
                                  className="inline-flex items-center gap-1 pl-3 pr-2 py-1 bg-blue-500 text-white rounded-full text-sm"
                                >
                                  {group.name}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGroup(group.groupId)}
                                    className="ml-1 mr-1 hover:bg-blue-600 rounded-full w-4 h-4 flex items-center justify-center"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Allowed Groups label - always above dropdown */}
                          <Label className="text-sm text-muted-foreground">Allowed Groups</Label>

                          {/* Dropdown to select groups - show when there are available groups */}
                          {availableGroups.length > 0 && (
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleAddGroup(e.target.value);
                                }
                              }}
                            >
                              <option value="">Select a group to add...</option>
                              {availableGroups.map((group) => (
                                <option key={group.groupId} value={group.groupId}>
                                  {group.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-3">
                    <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                    <Button type="button" disabled={!isAccessValid} onClick={handleNextStep}>Next</Button>
                  </CardFooter>
                </>
              )}

              {/* Step 2: Timeslots */}
              {currentStep === 2 && (
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    {/* Settings Row */}
                    <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-md flex-wrap">
                      <div className="flex items-center gap-2">
                        <Label>Booking Interval:</Label>
                        <select
                          className="h-9 rounded-md border border-input bg-white px-3 py-1 text-sm"
                          value={interval}
                          onChange={(e) => setInterval(Number(e.target.value))}
                        >
                          <option value={30}>30 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={90}>1.5 hours</option>
                          <option value={120}>2 hours</option>
                        </select>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleApplyWorkingHours}>
                        Apply working hours (09:00-17:00)
                      </Button>
                    </div>

                    {/* Days Schedule */}
                    <div className="space-y-3">
                      {DAYS.map(day => (
                        <div key={day} className="flex items-center gap-4 p-3 border rounded-md">
                          <div className="w-28">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={timeslotSettings[day]?.isOpen || false}
                                onChange={() => handleDayToggle(day)}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                              <span className="font-medium">{day}</span>
                            </label>
                          </div>

                          {timeslotSettings[day]?.isOpen && (
                            <div className="flex items-center gap-2">
                              <Label className="text-sm text-muted-foreground">From</Label>
                              <select
                                className="h-9 rounded-md border border-input bg-white px-3 py-1 text-sm"
                                value={timeslotSettings[day]?.startTime || "09:00"}
                                onChange={(e) => handleTimeChange(day, "startTime", e.target.value)}
                              >
                                {HOURS_OPTIONS.map(hour => (
                                  <option key={hour} value={hour}>{hour}</option>
                                ))}
                              </select>
                              <Label className="text-sm text-muted-foreground">To</Label>
                              <select
                                className="h-9 rounded-md border border-input bg-white px-3 py-1 text-sm"
                                value={timeslotSettings[day]?.endTime || "18:00"}
                                onChange={(e) => handleTimeChange(day, "endTime", e.target.value)}
                              >
                                {HOURS_OPTIONS.map(hour => (
                                  <option key={hour} value={hour}>{hour}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          {!timeslotSettings[day]?.isOpen && (
                            <span className="text-sm text-muted-foreground">Closed</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-3">
                    <Button type="button" variant="outline" onClick={handlePrevStep}>Back</Button>
                    <Button type="submit">{editingRoom ? "Update" : "Create"}</Button>
                  </CardFooter>
                </form>
              )}
            </Card>
          </div>
        )}

        <div className="flex justify-center">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    </div>
  );
};

export default ManageRooms;
