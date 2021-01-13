const FormElement = ({ label, name, id, type, value, onChange, children }) => {
  const renderElementByType = (type) => {
    switch (type) {
      case "text":
      case "password":
        return (
          <input
            className="p-2 border"
            type={type}
            name={name}
            id={id}
            value={value}
            onChange={onChange}
          />
        );

      case "select":
        return (
          <select
            className="p-2 border"
            name={name}
            id={id}
            value={value}
            onChange={onChange}
          >
            {children}
          </select>
        );

      default:
        // do nothing here
        return;
    }
  };

  return (
    <div className="flex flex-col">
      <label className="mb-2 font-bold text-gray-500" htmlFor={name}>
        {label}
      </label>
      {renderElementByType(type)}
    </div>
  );
};

export default FormElement;
