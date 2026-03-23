import { useNavigate } from "react-router-dom";
import "../../assets/css/category-card.css";

function CardCategorys({ id, name }) {
	const navigate = useNavigate();
	const handleCardClick = () => {
		navigate(`/Shop?categoryId=${id}`);
	};

	return (
		<article className="category-card" data-category-id={id} onClick={handleCardClick} style={{cursor: "pointer"}}>
			<h3 className="category-card__name">{name}</h3>
		</article>
	);
}

export default CardCategorys;
