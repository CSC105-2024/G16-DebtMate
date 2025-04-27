import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import group1 from "/assets/icons/group1.svg";

const EditGroup = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState({
    name: "",
    members: [],
    // Add other relevant group data fields
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch group data based on groupId
    const fetchGroupData = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual API call
        const response = await fetch(`/api/groups/${groupId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch group data");
        }

        const data = await response.json();
        setGroupData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace with your actual API call
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      });

      if (!response.ok) {
        throw new Error("Failed to update group");
      }

      // Navigate back to the group details page
      navigate(`/groups/${groupId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="edit-group-container">
      <h1>Edit Group</h1>
      <div className={`w-22 h-22 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 mb-2 max-[${XS}]:w-16 max-[${XS}]:h-16`}>
        <img
          src={group1}
          alt="Group Profile Picture"
          className="w-full h-full rounded-full object-cover cursor-pointer" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Group Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={groupData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Add other form fields here (members, settings, etc.) */}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(`/groups/${groupId}`)}
          >
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditGroup;
