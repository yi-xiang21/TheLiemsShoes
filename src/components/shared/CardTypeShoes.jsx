import { useNavigate } from "react-router-dom";
import "../../assets/css/type-shoes-card.css";

function CardTypeShoes({id, a, b }) {
	const image = a ;
	const name = b;
	const navegate = useNavigate();
	const handleCardClick = () =>{
		navegate(`/Shop?typeId=${id}`)
	}

	return (
		<article className="type-shoes-card" data-type-id={id} onClick={handleCardClick} style={{cursor: "pointer"}}>
			<div className="type-shoes-card__image-wrap">
				<img className="type-shoes-card__image" src={image} alt={name} loading="lazy" />
			</div>
			<h3 className="type-shoes-card__name">{name}</h3>
		</article>
	);
}

export default CardTypeShoes;
