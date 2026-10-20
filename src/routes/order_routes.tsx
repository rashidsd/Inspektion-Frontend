import AddOrder from "../pages/AddOrder";
import Protected from "../components/Protected";
import ShipData from "../pages/ShipData";
import ShippingList from "../pages/ShippingList";
import OrderList from "../pages/OrderList";
import ExportDocuments from "../pages/ExportDocuments";
import PaymentForm from "../pages/PaymentForm";

const routes = [
  {
    path: "/addOrder",
    element: (
      <Protected role="Add Order">
        <AddOrder />
      </Protected>
    ),
  },
  {
    path: "/shipData",
    element: (
      <Protected role="Shipping Info">
        <ShipData />
      </Protected>
    ),
  },
  {
    path: "/shipList",
    element: (
      <Protected role="Shipping List">
        <ShippingList />
      </Protected>
    ),
  },
{
    path: "/paymentForm",
    element: (
      <Protected role="Payment Form">
        <PaymentForm />
      </Protected>
    ),
  },

  {
    path: "/orderList",
    element: (
      <Protected role="Order List">
        <OrderList />
      </Protected>
    ),
  },
  {
    path: "/exportDocuments",
    element: (
      <Protected role="Export Documents">
        
        <ExportDocuments />
        
      </Protected>
    ),
  },
];

export default routes;
