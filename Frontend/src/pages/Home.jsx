// src/pages/Home.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import banner from "../assets/Images/banner.jpeg";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useEffect } from "react";
import { fetchAllGames } from "../game.store/gameThunk";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllInventoryItems,
  fetchInventoryItemById,
} from "../inventory.store/inventoryThunk";

const LeftArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute cursor-pointer z-10 top-1/2 left-3 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#fad73c]/20 transition"
  >
    <i className="fa-solid z-10 fa-chevron-left text-[#fad73c] text-xl md:text-2xl" />
  </button>
);

const RightArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute cursor-pointer top-1/2 right-3 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#fad73c]/20 transition"
  >
    <i className="fa-solid fa-chevron-right text-[#fad73c] text-xl md:text-2xl" />
  </button>
);

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1280 },
    items: 3, // 3 items for screens 1280px and above
  },
  desktop: {
    breakpoint: { max: 1279, min: 1024 },
    items: 3, // 3 items for screens between 1024px and 1279px
  },
  tablet: {
    breakpoint: { max: 1023, min: 768 },
    items: 2, // 2 items for screens between 768px and 1023px
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 1, // 2 items for screens below 768px
  },
};

const categories = [
  "All",
  "Strategy",
  "Adventure",
  "RPG",
  "Shooter",
  "Strategy",
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { games, loading } = useSelector((s) => s.games); // list not games
  const { inventories } = useSelector((s) => s.inventories);
  const [selectedCategory, setSelectedCategory] = useState("Choose Category");
  const [showCategories, setShowCategories] = useState(false);
  const [filteredGames, setFilteredGames] = useState(games);

  useEffect(() => {
    dispatch(fetchAllGames());
    dispatch(fetchAllInventoryItems());
  }, [dispatch]);

  useEffect(() => {
    setFilteredGames(games);
  }, [games]);

  const handleClick = async (id) => {
    // console.log("id: ", id);
    await dispatch(fetchInventoryItemById(id));
    navigate(`/product/${id}`); // navigate to product detail page with the product id
  };

  const handleShowAll = () => {
    setSelectedCategory("");
    setFilteredGames(games);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategories(false);
    if (category == "All") {
      setSelectedCategory("");
      setFilteredGames(games);
      return;
    }
    const filtered = games.filter((item) => item.genre === category);
    if (filtered.length > 0) {
      setFilteredGames(filtered);
    } else {
      setFilteredGames([]);
    }
  };

  return (
    <div className="bg-[#0f0c29] text-white">
      {/* Hero Section */}
      <div className="relative w-full h-[90vh] overflow-hidden">
        <img
          src={banner}
          alt="Gaming Banner"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            className="text-6xl md:text-7xl font-extrabold mb-6 text-[#ffe600] drop-shadow-xl"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ textShadow: "0 0 30px #ff0080" }}
          >
            Play Games. Have Fun.
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl max-w-2xl text-[#00d2ff] font-medium"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Level up your game — only at Scar Games!
          </motion.p>
        </div>
      </div>

      {/* Games Section */}
      <div className="py-20 md:px-20 bg-[#1a103d]">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#00d2ff] drop-shadow-lg">
          Our Games
        </h2>

        {/* Category Filter */}
        <div className="flex justify-center mb-10">
          <motion.div
            className="relative "
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => setShowCategories((prev) => !prev)}
              className="bg-gradient-to-r cursor-pointer from-[#4A00E0] to-[#8E2DE2] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
            >
              {selectedCategory ? selectedCategory : "Choose Category"}
            </button>

            {showCategories && (
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute  z-20 mt-4 w-64 bg-[#1c133a] rounded-2xl shadow-2xl p-4 space-y-2"
              >
                {/* <button
                  className="w-full text-left text-white hover:bg-[#2a1f55] p-2 rounded-xl transition"
                  onClick={handleShowAll}
                >
                  All Categories
                </button> */}

                {Array.from(new Set(categories)).map((cat, idx) => (
                  <button
                    key={idx}
                    className="w-full cursor-pointer text-left text-white hover:bg-[#2a1f55] p-2 rounded-xl transition"
                    onClick={() => handleCategorySelect(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Carousel */}
        {filteredGames.length > 0 ? (
          <Carousel
            customLeftArrow={<LeftArrow />}
            customRightArrow={<RightArrow />}
            responsive={responsive}
            swipeable={true}
            draggable={true}
            className="py-12"
          >
            {filteredGames.map((item, idx) => {
              const inventory = inventories.find(
                (inv) => inv.game_id === item.game_id
              );
              const isOutOfStock = inventory && inventory.stock_quantity === 0;

              return (
                <motion.div
                  key={idx}
                  className="group relative cursor-pointer bg-gradient-to-br from-[#1c133a] to-[#2a1f55] backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/10 transition-all duration-500 hover:shadow-pink-500/40 hover:-translate-y-2 mx-4"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleClick(item.game_id)}
                >
                  <div className="relative">
                    <img
                      src="https://cdn.cloudflare.steamstatic.com/steam/apps/1677740/header.jpg"
                      alt={item.title}
                      className="h-36 w-full object-cover rounded-2xl shadow-md transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className={`absolute top-2 right-2 px-3 py-1 text-xs rounded-lg font-bold shadow-md transition-all duration-500 ${
                        isOutOfStock
                          ? "bg-red-600/90 text-white animate-pulse"
                          : "bg-pink-500/80 text-white"
                      }`}
                    >
                      {isOutOfStock ? "OUT OF STOCK 🚫" : "HOT 🔥"}
                    </div>
                  </div>

                  <h3 className="mt-6 line-clamp-1 text-center text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent tracking-wide drop-shadow-sm">
                    {item.title}
                  </h3>

                  <div className="mt-4 h-1 w-1/2 mx-auto bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 rounded-full group-hover:w-3/4 transition-all duration-500"></div>
                </motion.div>
              );
            })}
          </Carousel>
        ) : (
          <motion.div
            className="flex justify-center items-center h-64 text-2xl font-bold text-pink-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            No Products Found 🚫
          </motion.div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-[#1a103d] to-[#0f0c29] py-24 text-center">
        <motion.h2
          className="text-4xl font-bold mb-8 text-[#ff1c8e] drop-shadow-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          Level Up Your Collection
        </motion.h2>
        <motion.button
          className="bg-[#00d2ff] cursor-pointer hover:bg-[#00a9cf] text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg transition duration-300"
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/cart")}
        >
          Your Cart
        </motion.button>
      </div>
    </div>
  );
};

export default Home;
