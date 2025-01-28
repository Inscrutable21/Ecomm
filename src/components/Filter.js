const Filter = ({ onFilter }) => {
    const [category, setCategory] = useState('');
  
    const handleFilter = () => {
      onFilter(category);
    };
  
    return (
      <div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>
        <button onClick={handleFilter}>Apply Filter</button>
      </div>
    );
  };
  
  export default Filter;