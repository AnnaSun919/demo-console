import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { fetchRooms, createRoom, updateRoom, deleteRoom } from "../actions/Rooms";
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
    groupIds: [],
  });

  useEffect(() => {
    dispatch(fetchRooms());
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        name: room.name,
        capacity: room.capacity.toString(),
        groupIds: room.groupIds || [],
      });
    } else {
      setEditingRoom(null);
      setFormData({ name: "", capacity: "", groupIds: [] });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleGroupToggle = (groupId) => {
    setFormData((prev) => ({
      ...prev,
      groupIds: prev.groupIds.includes(groupId)
        ? prev.groupIds.filter((id) => id !== groupId)
        : [...prev.groupIds, groupId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = { ...formData, capacity: parseInt(formData.capacity, 10) };

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
            <Button onClick={() => handleOpenModal()}>Create Room</Button>
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
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteRoom(room.id)}>Delete</Button>
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
                <CardTitle>{editingRoom ? "Edit Room" : "Create Room"}</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Room Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input id="capacity" type="number" min="1" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Allowed Groups (click to select)</Label>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                      {groups.map((group) => (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => handleGroupToggle(group.id)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${formData.groupIds.includes(group.id)
                            ? "bg-blue-500 text-white"
                            : "bg-muted hover:bg-muted/80"
                            }`}
                        >
                          {group.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                  <Button type="submit">{editingRoom ? "Update" : "Create"}</Button>
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
