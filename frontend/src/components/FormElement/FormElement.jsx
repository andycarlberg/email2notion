const FormElement = ({ label, name, id, type, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 font-bold text-gray-500" for={name}>
        {label}
      </label>
      <input
        className="p-2 border"
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormElement;
