import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGame, fetchAllGames } from "../game.store/gameThunk";
import { createInventoryItem } from "../inventory.store/inventoryThunk";
import { useNavigate } from "react-router-dom";

const InsertGame = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /* ---------- local form state ---------- */
  const [game, setGame] = useState({
    title: "",
    description: "",
    price: "",
    platform: "",
    genre: "",
    quantity: "", // ← added
  });

  const { user } = useSelector((s) => s.user);
  const { userLoggedIn } = useSelector((s) => s.userLoggedIn);

  useEffect(() => {
    if (!userLoggedIn || !user || user?.role === "Customer") {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGame((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!game.title || !game.price || game.price <= 0) {
      alert("Title and Price are required.");
      return;
    }

    console.log("Dispatching createGame with:", game);
    const newGame = await dispatch(createGame(game));
    // console.log("newly created game: ", newGame);
    // await dispatch(fetchAllGames());
    dispatch(
      createInventoryItem({
        game_id: newGame.data.game_id,
        stock_quantity: game.quantity,
      })
    );
    setGame({
      title: "",
      description: "",
      price: "",
      platform: "",
      genre: "",
      quantity: "",
    });
  };

  /* ---------- genre options ---------- */
  const genreOptions = [
    "Action",
    "Adventure",
    "RPG",
    "Sports",
    "Racing",
    "Strategy",
    "Puzzle",
  ];

  return (
    <div className="max-w-xl mx-auto mt-10 mb-8 p-6 bg-white/10 rounded-2xl shadow-xl backdrop-blur-md text-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#ffe600]">
        Insert New Game
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          name="title"
          placeholder="Game Title"
          value={game.title}
          onChange={handleChange}
          className="w-full p-3 bg-white/10 rounded-lg border border-[#fad73c] placeholder-[#ffd] focus:outline-none"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={game.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-3 bg-white/10 rounded-lg border border-[#fad73c] placeholder-[#ffd] focus:outline-none"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={game.price}
          onChange={handleChange}
          className="w-full p-3 bg-white/10 rounded-lg border border-[#fad73c] placeholder-[#ffd] focus:outline-none"
          required
          min="0"
        />

        <input
          name="platform"
          placeholder="Platform"
          value={game.platform}
          onChange={handleChange}
          className="w-full p-3 bg-white/10 rounded-lg border border-[#fad73c] placeholder-[#ffd] focus:outline-none"
          required
        />

        {/* Genre Dropdown */}
        <select
          name="genre"
          value={game.genre}
          onChange={handleChange}
          className="w-full p-3 bg-white/10 rounded-lg border border-[#fad73c] text-[#ffd] focus:outline-none"
          required
        >
          <option className="text-black" value="">
            Select Genre
          </option>
          {genreOptions.map((genre) => (
            <option key={genre} value={genre} className="text-black">
              {genre}
            </option>
          ))}
        </select>

        {/* Quantity Field */}
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={game.quantity}
          onChange={handleChange}
          className="w-full p-3 bg-white/10 rounded-lg border border-[#fad73c] placeholder-[#ffd] focus:outline-none"
          required
          min="0"
        />

        <button
          type="submit"
          className="w-full cursor-pointer bg-[#fad73c] hover:bg-yellow-400 transition-all py-3 rounded-xl font-semibold text-black"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default InsertGame;
