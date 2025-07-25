import React from "react";
import { Card, Dropdown, Table } from "react-bootstrap";

interface Transaction {
  date: string;
  time: string;
  sourceName: string;
  plan: string;
  sourceIcon: string;
  status: string;
  statusClass: string;
  amount: string;
}

interface TransactionsData {
  title: string;
  transactions: Transaction[];
}

interface TransactionsWidgetProps {
  data?: TransactionsData;
  showDropdown?: boolean;
}

const defaultTransactionsData: TransactionsData = {
  title: "Transactions",
  transactions: [
    {
      date: "10 Sep,2024",
      time: "8:20 PM",
      sourceName: "Paypal",
      plan: "Business Plan",
      sourceIcon: "/assets/images/apps/paypal.png",
      status: "Paid",
      statusClass: "bg-success text-success",
      amount: "$5897",
    },
    {
      date: "10 Sep,2024",
      time: "8:20 PM",
      sourceName: "Visa",
      plan: "Business Plan",
      sourceIcon: "/assets/images/apps/13.png",
      status: "Unpaid",
      statusClass: "bg-danger text-danger",
      amount: "$9638",
    },
    {
      date: "10 Sep,2024",
      time: "8:20 PM",
      sourceName: "Behance",
      plan: "Business Plan",
      sourceIcon: "/assets/images/apps/behance.png",
      status: "Paid",
      statusClass: "bg-success text-success",
      amount: "$9638",
    },
    {
      date: "10 Sep,2024",
      time: "8:20 PM",
      sourceName: "Spotify",
      plan: "Business Plan",
      sourceIcon: "/assets/images/apps/07.png",
      status: "Paid",
      statusClass: "bg-success text-success",
      amount: "$9638",
    },
    {
      date: "10 Sep,2024",
      time: "8:20 PM",
      sourceName: "Google",
      plan: "Business Plan",
      sourceIcon: "/assets/images/apps/05.png",
      status: "Unpaid",
      statusClass: "bg-danger text-danger",
      amount: "$9638",
    },
    {
      date: "10 Sep,2024",
      time: "8:20 PM",
      sourceName: "Apple",
      plan: "Business Plan",
      sourceIcon: "/assets/images/apps/apple.png",
      status: "Paid",
      statusClass: "bg-success text-success",
      amount: "$9638",
    },
  ],
};

const TransactionsWidget: React.FC<TransactionsWidgetProps> = ({
  data,
  showDropdown = true,
}) => {
  const transactionsData = data || defaultTransactionsData;

  return (
    <Card className="rounded-4 w-100">
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h5 className="mb-0">{transactionsData.title}</h5>
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
        <div className="table-responsive">
          <Table className="align-middle mb-0 table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Source Name</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactionsData.transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>
                    <div>
                      <h6 className="mb-0">{transaction.date}</h6>
                      <p className="mb-0">{transaction.time}</p>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center flex-row gap-3">
                      <div>
                        <img
                          src={transaction.sourceIcon}
                          width="35"
                          alt={transaction.sourceName}
                        />
                      </div>
                      <div>
                        <h6 className="mb-0">{transaction.sourceName}</h6>
                        <p className="mb-0">{transaction.plan}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`card-lable ${transaction.statusClass} bg-opacity-10`}>
                      <p className={`${transaction.statusClass.split(' ')[1]} mb-0`}>
                        {transaction.status}
                      </p>
                    </div>
                  </td>
                  <td>
                    <h5 className="mb-0">{transaction.amount}</h5>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TransactionsWidget;
