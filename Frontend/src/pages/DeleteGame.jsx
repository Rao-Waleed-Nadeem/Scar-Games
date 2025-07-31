// src/pages/DeleteGamePage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaTrashAlt } from "react-icons/fa";
import { fetchAllGames, deleteGame } from "../game.store/gameThunk"; // <-- your thunks
import { useNavigate } from "react-router-dom";

/* ---------- Single row with trash button ---------- */
const GameRow = ({ game, onAskDelete }) => (
  <motion.div
    className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-xl flex items-center justify-between mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div>
      <h3 className="text-2xl font-semibold text-[#ffe600]">{game.title}</h3>
      <p className="text-[#00d2ff]">{game.genre}</p>
    </div>
    <button
      className="text-[#fad73c] hover:text-[#ff0080] transition"
      onClick={() => onAskDelete(game.game_id)}
    >
      <FaTrash size={24} />
    </button>
  </motion.div>
);

/* ---------- Modal ---------- */
const ConfirmModal = ({ open, onClose, onConfirm }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#24243e] w-96 p-8 rounded-2xl shadow-xl"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <h2 className="text-2xl font-semibold text-center text-[#ffe600] mb-6">
            Delete this game?
          </h2>
          <div className="flex justify-around">
            <button
              onClick={onClose}
              className="bg-[#00d2ff] px-6 py-2 rounded-lg hover:bg-[#00a9cf]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-[#ff1c8e] px-6 py-2 rounded-lg hover:bg-[#ff0066]"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ---------- Page ---------- */
export default function DeleteGame() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { games, loading } = useSelector((s) => s.games); // list not games
  const { inventories } = useSelector((S) => S.inventories);
  const [pendingId, setPendingId] = useState(null);

  const { user } = useSelector((s) => s.user);
  const { userLoggedIn } = useSelector((s) => s.userLoggedIn);

  useEffect(() => {
    if (!userLoggedIn || !user || user?.role === "Customer") {
      navigate("/");
    }
  }, []);

  /* initial fetch */
  useEffect(() => {
    dispatch(fetchAllGames());
  }, [dispatch]);

  /* confirm deletion */
  const handleConfirm = async () => {
    await dispatch(deleteGame(pendingId)); // thunk removes from DB & Redux
    setPendingId(null); // UI updates instantly
    await dispatch(fetchAllGames());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-8 text-white">
      <h1 className="text-4xl font-bold text-center mb-12 text-[#ffe600]">
        Delete Game
      </h1>

      {loading ? (
        <p className="text-center text-[#ffe600]">Loading…</p>
      ) : games?.length ? (
        games?.map((g) => (
          <motion.div
            key={g.game_id}
            whileHover={{ scale: 1.04 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-xl transition-all duration-300 ease-in-out mb-8"
          >
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-6 flex-1">
                <img
                  src="https://cdn.cloudflare.steamstatic.com/steam/apps/1677740/header.jpg"
                  alt={g.title}
                  className="w-32 h-32 object-cover rounded-2xl shadow-md"
                />
                <div className="space-y-2 w-full">
                  <h3 className="text-xl font-semibold text-[#ffe600] truncate max-w-xs">
                    {g.title}
                  </h3>
                  <p className="text-white/70 text-sm line-clamp-1 lg:w-96 max-w-md">
                    {g.description}
                  </p>
                  <div className="flex items-center justify-between mt-2 max-w-md">
                    <p className="text-lg text-[#00d2ff] font-semibold min-w-[80px]">
                      ${g.price}
                    </p>
                    <p className="text-white/80 min-w-[100px] text-right">
                      Qty:{" "}
                      {inventories?.find((i) => i.game_id === g.game_id)
                        ?.stock_quantity ?? 0}
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                className="text-red-500 cursor-pointer hover:text-red-600 text-2xl font-semibold transition-all"
                onClick={() => setPendingId(g.game_id)}
              >
                <FaTrashAlt />
              </motion.button>
            </div>
          </motion.div>
        ))
      ) : (
        <p className="text-center text-lg text-[#ffe600]">
          No games available to delete.
        </p>
      )}

      <ConfirmModal
        open={Boolean(pendingId)}
        onClose={() => setPendingId(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
