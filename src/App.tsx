import React, { useEffect, useMemo, useState } from "react";
import { upayments } from "./lib/upayments";
import {
  CreateOrderData,
  Customer,
  Order,
  Product,
  Reference,
  CustomerCard,
  MultiVendorOrderData,
  Endpoints,
  PaymentMethod
} from "./types";

const products: Product[] = [
  {
    name: "Logitech K380",
    description:
      "Logitech K380 / Easy-Switch for Upto 3 Devices, Slim Bluetooth Tablet Keyboar ",
    price: 10,
    quantity: 1,
  },
  {
    name: "Logitech M171 Wireless Optical Mouse",
    description:
      "Logitech M171 Wireless Optical Mouse  (2.4GHz Wireless, Blue Grey)",
    price: 10,
    quantity: 1,
  },
];

const order: Order = {
  id: "202210101255255144669",
  reference: "11111991",
  description: "Purchase order received for Logitech K380 Keyboard",
  currency: "KWD",
  amount: 20,
};

const reference: Reference = {
  id: "202210101255255144669",
};

const customer: Customer = {
  uniqueId: "2129879kjbljg767881",
  name: "Dharmendra Kakde",
  email: "kakde.dharmendra@upayments.com",
  mobile: "+96566336537",
};

const orderData: CreateOrderData = {
  products,
  order,
  language: "en",
  reference,
  customer,
  returnUrl: "http://localhost:3000",
  cancelUrl: "http://localhost:3000",
  notificationUrl: "https://webhook.site/d7c6e1c8-b98b-4f77-8b51-b487540df336",
  customerExtraData: "User define data",
};

const getOrderData = (isWhiteLabel: boolean): CreateOrderData => {
  return isWhiteLabel
    ? {
        ...orderData,
        paymentGateway: {
          src: "knet",
        },
      }
    : orderData;
};

const App = () => {
  const [customerToken, setCustomerToken] = useState<number | null>(null);
  const [loading, setLoading] = useState<number | null>(null);
  const [creatingCustomerToken, setCreatingCustomerToken] =
    useState<boolean>(false);
  const [isWhiteLabel, setIsWhiteLabel] = useState<boolean>(
    sessionStorage.getItem("isWhiteLabel") === "true"
  );
  const [error, setError] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("createOrder");
  const [requestData, setRequestData] = useState<string>(
    JSON.stringify(getOrderData(isWhiteLabel), null, 2)
  );

  const params = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
  }, []);

  const [customerTokenInp, setCustomerTokenInp] = useState<string>("");

  useEffect(() => {
    console.log(params);
    // if (params.result === "CAPTURED") {
    setApiResponse(params);
    // setTimeout(() => {
    //   window.location.href = "http://localhost:3000";
    // }, 3000);
    // }
  }, [params]);

  const handleError = (err: any) => {
    setError(err.response?.data?.message || "An error occurred");
    setApiResponse(err.response?.data || err);
    setTimeout(() => setError(""), 5000);
  };

  const handleApiResponse = (res: any) => {
    setApiResponse(res);
    if (res.data?.link) {
      setTimeout(() => {
        window.location.href = res.data.link;
      }, 1000);
    }
  };

  const endpoints: Endpoints = {
    createOrder: {
      label: "Create Order",
      defaultData: getOrderData(isWhiteLabel),
      action: (data: any) => upayments.createOrder(data),
    },
    createMultiVendorOrder: {
      label: "Create Multi-Vendor Order",
      defaultData: {
        ...getOrderData(isWhiteLabel),
        extraMerchantData: [
          {
            amount: 100,
            knetCharge: 0.500,
            knetChargeType: "fixed",
            ccCharge: 10,
            ccChargeType: "percentage",
            ibanNumber: "KW91KFHO0000000000051010173254"
          },
          {
            amount: 120,
            knetCharge: 0.750,
            knetChargeType: "fixed",
            ccCharge: 12,
            ccChargeType: "percentage",
            ibanNumber: "KW31NBOK0000000000002010177457"
          }
        ]
      },
      action: (data: MultiVendorOrderData) => upayments.createOrder(data),
    },
    createInvoice: {
      label: "Create Invoice",
      defaultData: { ...getOrderData(isWhiteLabel), notificationType: "all" },
      action: (data: any) => upayments.createInvoice(data),
    },
    saveCard: {
      label: "Save Card",
      defaultData: {
        customerUniqueToken: customerToken,
        returnUrl: "http://localhost:3000",
      },
      action: (data: any) => upayments.saveCard(data),
    },
    retrieveCards: {
      label: "Retrieve Cards",
      defaultData: { customerUniqueToken: customerToken },
      action: (data: any) => upayments.retrieveCards(data),
    },
    createRefund: {
      label: "Create Refund",
      defaultData: {
        orderId: "",
        totalPrice: 10,
        customerFirstName: "Jhon",
        customerEmail: "jhon@upayment.com",
        customerMobileNumber: "+96512345678",
        reference: "11223344",
        notifyUrl: "https://upayments.com/en",
      },
      action: (data: any) => upayments.createSingleRefund(data),
    },
    createMultiVendorRefund: {
      label: "Create Multi-Vendor Refund",
      defaultData: {
        "orderId": "ME3OdxVO6m20221010125525514466916880191941658236257649d20fa014b0",
        "refundPayload": [
            {
                "refundRequestId": "WEVsTGo0ZTlOMg==",
                "ibanNumber": "KW91KFHO0000000000051010173254",
                "totalPaid": "10.000",
                "refundedAmount": 0,
                "remainingLimit": 10,
                "amountToRefund": 1,
                "merchantType": "vendor"
            },
            {
                "refundRequestId": "RVc3OFhCRFoxSg==",
                "ibanNumber": "KW31NBOK0000000000002010177457",
                "totalPaid": "10.000",
                "refundedAmount": 0,
                "remainingLimit": 10,
                "amountToRefund": 1,
                "merchantType": "vendor"
            }
        ],
        "receiptId": "NHDBC55214",
        "customerFirstName": "Jhon Smith",
        "customerEmail": "jhonsmith@upayments.com",
        "customerMobileNumber": "+96512345678",
        "reference": "HCNHD1425KSM",
        "notifyUrl": "https://upayments.com"
    },
      action: (data: any) => upayments.createMultiVendorRefund(data),
    },
    getDepositStatus: {
      label: "Get Deposit Status",
      defaultData: {
        trackId: ""
      },
      action: (data: { trackId: string }) => upayments.getDepositStatus(data.trackId),
      description: "Check the status of a deposit using the trackId from a previous transaction"
    },
    getSingleRefundStatus: {
      label: "Get Single Refund Status",
      defaultData: {
        orderId: ""
      },
      action: (data: { orderId: string }) => upayments.getSingleRefundStatus(data.orderId),
      description: "Check the status of a single refund using the order ID"
    },
    getMultiRefundStatus: {
      label: "Get Multi-Vendor Refund Status",
      defaultData: {
        orderId: ""
      },
      action: (data: { orderId: string }) => upayments.getMultiRefundStatus(data.orderId),
      description: "Check the status of a multi-vendor refund using the order ID"
    },
    getPaymentButtonStatus: {
      label: "Get Payment Button Status",
      defaultData: {},
      action: () => upayments.getPaymentButtonStatus(),
      description: "Check available payment methods status (Rate limited: 1 request/minute)"
    },
  };

  useEffect(() => {
    if (selectedEndpoint) {
      setRequestData(
        JSON.stringify(
          endpoints[selectedEndpoint].defaultData,
          null,
          2
        )
      );
    }
  }, [selectedEndpoint, customerToken, isWhiteLabel]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">UPayments API Testing Interface</h1>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  checked={isWhiteLabel}
                  onChange={(e) => {
                    setIsWhiteLabel(e.target.checked);
                    sessionStorage.setItem("isWhiteLabel", String(e.target.checked));
                  }}
                />
                <span className="ml-2 text-gray-700">White Label Mode</span>
              </label>
              {loading !== null && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm text-gray-600">Processing request...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Configuration</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endpoint
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedEndpoint}
                    onChange={(e) => {
                      setSelectedEndpoint(e.target.value);
                      const endpoint = endpoints[e.target.value];
                      setRequestData(JSON.stringify(endpoint.defaultData, null, 2));
                    }}
                  >
                    {Object.entries(endpoints).map(([key, { label, description }]) => (
                      <option key={key} value={key} title={description}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {endpoints[selectedEndpoint]?.description && (
                    <p className="mt-2 text-sm text-gray-600">
                      {endpoints[selectedEndpoint].description}
                    </p>
                  )}
                </div>

                {selectedEndpoint === 'getPaymentButtonStatus' && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">Rate Limit Warning</h3>
                        <div className="mt-2 text-sm text-amber-700">
                          <p>This endpoint is rate limited to 1 request per minute. Excessive requests may result in temporary blocking.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Data
                  </label>
                  <div className="relative">
                    <textarea
                      className="w-full h-[400px] px-4 py-3 font-mono text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={requestData}
                      onChange={(e) => setRequestData(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={loading !== null}
                  onClick={() => {
                    try {
                      const data = JSON.parse(requestData);
                      setLoading(1);
                      const endpoint = endpoints[selectedEndpoint];
                      endpoint
                        .action(data)
                        .then(handleApiResponse)
                        .catch(handleError)
                        .finally(() => setLoading(null));
                    } catch (err) {
                      handleError(err);
                    }
                  }}
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Response</h2>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-4 h-[500px] overflow-auto">
                {apiResponse ? (
                  <div className="space-y-4">
                    {apiResponse.data?.paymentMethods ? (
                      <div className="bg-white rounded-lg shadow p-6 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(Object.entries(apiResponse.data.paymentMethods) as [string, PaymentMethod][]).map(([key, method]) => (
                            <div
                              key={key}
                              className={`p-4 rounded-lg border transition-all duration-200 ${
                                method.enabled
                                  ? 'bg-green-50 border-green-200 hover:shadow-md'
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900">{method.displayName}</h4>
                                  <p className={`text-sm mt-1 ${
                                    method.enabled ? 'text-green-600' : 'text-gray-500'
                                  }`}>
                                    {method.enabled ? 'Available' : 'Not Available'}
                                  </p>
                                </div>
                                {method.enabled ? (
                                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium text-gray-700">Last Updated:</span>
                              <br />
                              {new Date(apiResponse.data.lastUpdated).toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Next Update Allowed:</span>
                              <br />
                              {new Date(apiResponse.data.nextUpdateAllowedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-auto font-mono text-sm">
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No response yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
