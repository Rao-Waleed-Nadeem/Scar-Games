// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const actions = [
  { label: "Insert Game", value: "insert", icon: "fa-plus", path: "/add-game" },
  {
    label: "Update Game",
    value: "update",
    icon: "fa-pen-to-square",
    path: "/update-game",
  },
  {
    label: "Delete Game",
    value: "delete",
    icon: "fa-trash",
    path: "/delete-game",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedAction, setSelectedAction] = useState("");
  const { user } = useSelector((s) => s.user);
  const { userLoggedIn } = useSelector((s) => s.userLoggedIn);

  useEffect(() => {
    if (!userLoggedIn || !user || user?.role === "Customer") {
      navigate("/");
    }
  }, []);
  const handleSelect = (action) => {
    navigate(action.path); // go straight to the page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-8 text-white">
      <h1 className="text-4xl font-bold text-center mb-12 text-[#ffe600] drop-shadow">
        Admin Control Panel
      </h1>
      {!selectedAction && (
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {actions.map((action) => (
            <motion.div
              key={action.value}
              className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl cursor-pointer hover:scale-105 hover:shadow-xl transition-all text-center"
              whileHover={{ scale: 1.05 }}
              onClick={() => handleSelect(action)}
            >
              <i
                className={`fa-solid ${action.icon} text-4xl text-[#fad73c] mb-4`}
              ></i>
              <h2 className="text-2xl font-semibold">{action.label}</h2>
            </motion.div>
          ))}
        </div>
      )}
      {/* Conditionally Render Based on Action */}
      {/* {selectedAction === "insert" && (
        <div onClick={() => navigate("/add-game")} className="mt-12">
         
          <h2 className="text-3xl font-bold text-center text-[#00d2ff]">
            Insert New Game
          </h2>
       
        </div>
      )} */}
      {/* {selectedAction === "update" && (
        <div onClick={() => navigate("/update-game")} className="mt-12">
          <h2 className="text-3xl font-bold text-center text-[#00d2ff]">
            Select Game to Update
          </h2>
          
        </div>
      )} */}
      {/* {selectedAction === "delete" && (
        <div onClick={() => navigate("/delete-game")} className="mt-12">
          <h2 className="text-3xl font-bold text-center text-[#ff1c8e]">
            Select Game to Delete
          </h2>
        </div>
      )} */}
    </div>
  );
};

export default AdminDashboard;
