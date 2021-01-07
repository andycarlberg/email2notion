const Card = ({ title, children }) => {
  return (
    <section className="flex-grow bg-white border-2 rounded-lg border-blue-700 shadow-md">
      <header className="p-3 bg-blue-500 text-2xl font-bold text-white">
        {title}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
};

export default Card;
