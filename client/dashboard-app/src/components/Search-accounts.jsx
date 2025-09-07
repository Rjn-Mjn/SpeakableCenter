import { SearchIcon } from "lucide-react";
import "../styles/SearchAccounts.css";

export default function SearchAccounts() {
  return (
    <div className="search-accounts-container">
      <div className="search-icon">
        <SearchIcon />
      </div>
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Type a name to start searching..."
        />
      </div>
    </div>
  );
}
