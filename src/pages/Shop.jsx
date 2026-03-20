
import CardProducts from "../components/shared/CardProducts.jsx";

const demoProducts = [
    {
        id: 1,
        image: "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/5fdb7f69-65fc-4563-b4f0-29f5b116f0aa/W+NIKE+V2K+RUN.png",
        name: "Nike V2K Run",
        category: "Women's Shoes",
        price: 3119000,
    },
    {
        id: 2,
        image: "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/df6cc4dd-b36d-4506-9f7e-34e77ec2a3f4/AIR+FORCE+1+%2707.png",
        name: "Nike Air Force 1 '07",
        category: "Men's Shoes",
        price: 3239000,
    },
    {
        id: 3,
        image: "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/31a89596-778d-4f46-aa13-7a27c8f6f7be/AIR+MAX+90.png",
        name: "Nike Air Max 90",
        category: "Lifestyle",
        price: 3829000,
    },
    {
        id: 4,
        image: "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/fd001f6e-bf40-4770-a4e2-cf0f4e6f905d/PEGASUS+41.png",
        name: "Nike Pegasus 41",
        category: "Running",
        price: 3829000,
    },
];

function Shop() {
    return (
        <section style={{ padding: "8px 4px 24px" }}>
            <h1 style={{ margin: "0 0 16px", fontSize: "28px" }}>Shop</h1>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "16px",
                }}
            >
                {demoProducts.map((product) => (
                    <CardProducts key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}

export default Shop;