// src/pages/UpdateGamePage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGames, updateGame } from "../game.store/gameThunk";
import {
  fetchAllInventoryItems,
  updateInventoryItem,
} from "../inventory.store/inventoryThunk";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UpdateGame = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { games, loading } = useSelector((s) => s.games);
  const { inventories } = useSelector((s) => s.inventories);
  const [editing, setEditing] = useState(null); // game being edited

  const { user } = useSelector((s) => s.user);
  const { userLoggedIn } = useSelector((s) => s.userLoggedIn);

  useEffect(() => {
    if (!userLoggedIn || !user || user?.role === "Customer") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    dispatch(fetchAllGames());
    dispatch(fetchAllInventoryItems());
  }, [dispatch]);

  const openModal = (g) => {
    const inventory = inventories.find((i) => i.game_id === g.game_id);
    setEditing({
      ...g,
      stock_quantity: inventory?.stock_quantity ?? 0, // default to 0 if not found
    });
  };

  const closeModal = () => setEditing(null);

  const handleSave = async () => {
    const requiredFields = [
      "title",
      "description",
      "price",
      "platform",
      "genre",
      "stock_quantity",
    ];

    // Check for empty fields
    for (const field of requiredFields) {
      if (!editing[field] || editing[field].toString().trim() === "") {
        alert(`Field "${field}" cannot be empty.`);
        return;
      }
    }
    const originalGame = games.find((game) => game.id === editing.id);
    const originalInventory = inventories.find(
      (i) => i.game_id === editing.game_id
    );

    let hasGameChanged = false;
    let hasInventoryChanged = false;

    // Check if any game field has changed
    ["title", "description", "price", "platform", "genre"].forEach((field) => {
      if (editing[field] !== originalGame[field]) {
        hasGameChanged = true;
      }
    });

    // Check if stock quantity has changed
    if (
      Number(editing.stock_quantity) !==
      Number(originalInventory?.stock_quantity ?? 0)
    ) {
      hasInventoryChanged = true;
    }

    // Now dispatch accordingly
    if (hasGameChanged) {
      await dispatch(updateGame(editing));
    }
    if (hasInventoryChanged) {
      await dispatch(
        updateInventoryItem({
          game_id: editing.game_id,
          stock_quantity: Number(editing.stock_quantity),
        })
      );
    }

    // If nothing changed, no dispatch happens
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-10 text-white">
      <h1 className="text-4xl font-bold text-center mb-12 text-[#ffe600] drop-shadow">
        Update Game
      </h1>

      {/* grid */}
      {loading ? (
        <p className="text-center">Loading…</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {games?.map((g, idx) => (
            <motion.div
              key={g.game_id}
              onClick={() => openModal(g)}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer bg-gradient-to-r from-[#442288] via-[#4b2e83] to-[#4474bb] backdrop-blur-md p-6 rounded-3xl shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
            >
              <div className="relative overflow-hidden rounded-3xl">
                {/* Game Image */}
                <img
                  src="https://cdn.cloudflare.steamstatic.com/steam/apps/1677740/header.jpg"
                  alt={g.title}
                  className="w-full h-48 object-cover rounded-2xl mb-4 transition-all duration-500 ease-in-out transform hover:scale-110"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent opacity-30 rounded-2xl"
                />
              </div>
              <h2 className="text-2xl font-extrabold text-[#fad73c] mb-2">
                {g.title}
              </h2>
              <p className="text-sm text-white/70 line-clamp-2 mb-3">
                {g.description}
              </p>
              <div className="flex justify-between items-center">
                <p className="mt-3 text-[#00d2ff] text-lg font-semibold">
                  ${g.price}
                </p>
                {/* Show quantity */}
                <p className="mt-1 text-white/80">
                  Qty:{" "}
                  {inventories?.find((i) => i.game_id === g.game_id)
                    ?.stock_quantity ?? 0}
                </p>
              </div>
              {/* Hover effect */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-pink-500 opacity-0 hover:opacity-40 transition-opacity duration-300 ease-in-out rounded-2xl"
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-full max-w-lg bg-[#1f1147] p-8 rounded-2xl shadow-2xl"
            >
              <h3 className="text-3xl font-bold text-center mb-6 text-[#ffe600]">
                Edit Game
              </h3>

              {/* form */}
              {[
                "title",
                "description",
                "price",
                "platform",
                "genre",
                "stock_quantity",
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field[0].toUpperCase() + field.slice(1)}
                  type={
                    field === "price" || field === "stock_quantity"
                      ? "number"
                      : "text"
                  }
                  min="0"
                  value={editing[field] ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, [field]: e.target.value })
                  }
                  className="w-full mb-4 p-3 bg-white/10 rounded-lg border border-[#fad73c] focus:outline-none"
                />
              ))}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 cursor-pointer bg-[#fad73c] hover:bg-yellow-400 py-3 rounded-xl font-semibold text-black"
                >
                  Save
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 cursor-pointer bg-red-400 hover:bg-red-500 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpdateGame;
