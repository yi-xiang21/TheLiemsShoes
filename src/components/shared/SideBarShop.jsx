import { useNavigate } from "react-router-dom";
import "../../assets/css/sidebar-shop.css";

function SideBarShop({id, title, isActive, onClick}) {

	return (
		<div className={`sidebar-shop-item ${isActive ? "active" : ""}`} 
		data-category-id={id} 
		onClick={onClick} 
		style={
			{
				cursor: "pointer",
				fontWeight: isActive ? "bold" : "normal",
				color: isActive ? "#000" : "#666"
				}}>
			<span className="sidebar-shop-item__title">{title}</span>
		</div>
	);
}

export default SideBarShop;
