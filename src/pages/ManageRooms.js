import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchRooms, fetchRoomById, createRoom, updateRoom, deleteRoom } from "../actions/Rooms";
import { fetchGroups } from "../actions/Groups";

const ManageRooms = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { rooms, isLoading } = useSelector((state) => state.rooms);
  const { groups } = useSelector((state) => state.groups);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    description: "",
    groupIds: [],
    isPublic: false,
    isOpen: true,
  });

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
          isPublic: roomData.isPublic || false,
          isOpen: roomData.status === "open",
        });
      }
    } else {
      setEditingRoom(null);
      setFormData({ name: "", capacity: "", description: "", groupIds: [], isPublic: false, isOpen: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  // Get group ID (handle both id and groupId)
  const getGroupId = (group) => group.groupId;

  // Add group from dropdown
  const handleAddGroup = (groupId) => {
    const id = Number(groupId);
    if (!id || formData.groupIds.includes(id)) return;
    setFormData((prev) => ({
      ...prev,
      groupIds: [...prev.groupIds, id],
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      name: formData.name,
      description: formData.description,
      status: formData.isOpen ? "open" : "closed",
      capacity: formData.capacity,
      isPublic: formData.isPublic,
      groupIds: formData.groupIds,
    };

    if (editingRoom) {
      const result = await dispatch(updateRoom(editingRoom.id, submitData));
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-[450px]">
              <CardHeader>
                <CardTitle>{editingRoom ? "Edit Room" : "Add Room"}</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
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
                    {/* <p className="text-sm text-muted-foreground">Please select at least one group or mark as public</p> */}

                    {/* Public checkbox */}
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

                    {/* Group selection - only show when not public */}
                    {!formData.isPublic && (
                      <>
                        <Label className="text-sm text-muted-foreground">Allowed Groups</Label>
                        {/* Selected groups as tags - ABOVE dropdown */}
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

                        {/* Dropdown to select groups */}
                        <Select onValueChange={(value) => handleAddGroup(value)}>
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Select a group to add..." />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {availableGroups.map((group) => (
                              <SelectItem key={group.groupId} value={String(group.groupId)}>
                                {group.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                  <Button type="submit" disabled={!isAccessValid}>{editingRoom ? "Update" : "Create"}</Button>
                </CardFooter>
              </form>
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
