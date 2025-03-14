const code = `import { motion } from 'framer-motion';

export default function AnimatedCardsGrid() {
  return (
    <div className="flex items-center justify-center w-full h-[400px] bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-8">
    {/* GRID CONTAINER */}
      <div className="grid grid-cols-2 gap-6">
      {/* ANIMATED CARDS */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-lg p-4 w-[140px] h-[140px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.1,
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            {/* ANIMATED BARS */}
            <motion.div
              className="w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4"
              whileHover={{ scaleX: 1.2 }}
            />

            <motion.div
              className="w-3/4 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mb-4"
              whileHover={{ scaleX: 1.2 }}
            />

            <motion.div
              className="w-1/2 h-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
              whileHover={{ scaleX: 1.2 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}`;

export const snippet = code;
