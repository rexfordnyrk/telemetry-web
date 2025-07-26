import React from "react";
import { Card, Dropdown } from "react-bootstrap";

interface Product {
  name: string;
  sales: string;
  price: string;
  change: string;
  changeDirection: "up" | "down";
  image: string;
}

interface PopularProductsData {
  title: string;
  products: Product[];
}

interface PopularProductsWidgetProps {
  data?: PopularProductsData;
  showDropdown?: boolean;
}

const defaultPopularProductsData: PopularProductsData = {
  title: "Popular Products",
  products: [
    {
      name: "Apple Hand Watch",
      sales: "Sale: 258",
      price: "$199",
      change: "+12%",
      changeDirection: "up",
      image: "/assets/images/top-products/01.png",
    },
    {
      name: "Mobile Phone Set",
      sales: "Sale: 169",
      price: "$159",
      change: "+14%",
      changeDirection: "up",
      image: "/assets/images/top-products/02.png",
    },
    {
      name: "Grey Shoes Pair",
      sales: "Sale: 859",
      price: "$279",
      change: "-12%",
      changeDirection: "down",
      image: "/assets/images/top-products/04.png",
    },
    {
      name: "Blue Yoga Mat",
      sales: "Sale: 328",
      price: "$389",
      change: "+25%",
      changeDirection: "up",
      image: "/assets/images/top-products/05.png",
    },
    {
      name: "White water Bottle",
      sales: "Sale: 992",
      price: "$584",
      change: "-25%",
      changeDirection: "down",
      image: "/assets/images/top-products/06.png",
    },
  ],
};

const PopularProductsWidget: React.FC<PopularProductsWidgetProps> = ({
  data,
  showDropdown = true,
}) => {
  const productsData = data || defaultPopularProductsData;

  return (
    <Card className="w-100 rounded-4">
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h5 className="mb-0">{productsData.title}</h5>
          </div>
          {showDropdown && (
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                className="dropdown-toggle-nocaret options"
                as="a"
                href="javascript:;"
              >
                <span className="material-icons-outlined fs-5">
                  more_vert
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="javascript:;">Action</Dropdown.Item>
                <Dropdown.Item href="javascript:;">Another action</Dropdown.Item>
                <Dropdown.Item href="javascript:;">Something else here</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        <div className="d-flex flex-column gap-4">
          {productsData.products.map((product, index) => (
            <div key={index} className="d-flex align-items-center gap-3">
              <img
                src={product.image}
                width="55"
                className="rounded-circle"
                alt={product.name}
              />
              <div className="flex-grow-1">
                <h6 className="mb-0">{product.name}</h6>
                <p className="mb-0">{product.sales}</p>
              </div>
              <div className="text-center">
                <h6 className="mb-1">{product.price}</h6>
                <p className={`mb-0 font-13 ${product.changeDirection === "up" ? "text-success" : "text-danger"}`}>
                  {product.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default PopularProductsWidget;
