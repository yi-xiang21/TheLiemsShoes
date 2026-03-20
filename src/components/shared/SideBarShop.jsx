import "../../assets/css/sidebar-shop.css";

function SideBarShop({ title, onClick }) {


	return (
		<div className="sidebar-shop-item">
			<span className="sidebar-shop-item__title">{title}</span>
		</div>
	);
}

export default SideBarShop;
