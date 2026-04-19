/**
 * GooglePayButton
 *
 * Wraps the official @google-pay/button-react component with the AISmartKheti
 * subscription configuration (₹50 / INR / India).
 *
 * Environment is set to TEST so no real money is charged.
 * Replace with "PRODUCTION" and real merchant credentials before going live.
 *
 * The `onSuccess` callback is called after the Google Pay sheet confirms the
 * payment (TEST mode does not process real payments — swap the gateway for a
 * real processor such as Razorpay before production).
 */
import GooglePayButtonReact from '@google-pay/button-react';

interface Props {
  onSuccess: (paymentData: google.payments.api.PaymentData) => void;
  onError?: (err: Error | google.payments.api.PaymentsError) => void;
  onCancel?: () => void;
  /** Called when the API has determined whether Google Pay is available. */
  onReadyToPayChange?: (available: boolean) => void;
}

/**
 * Configuration for Google Pay.
 * Uses the "example" test gateway — replace `gateway` and `gatewayMerchantId`
 * with your actual payment processor credentials (e.g. Razorpay, PayU) before
 * going live.
 */
const paymentRequest: google.payments.api.PaymentDataRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [
    {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        // RuPay is handled through UPI inside Google Pay; Visa and Mastercard
        // cover the web card payment methods available in India.
        allowedCardNetworks: ['MASTERCARD', 'VISA'],
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          // Replace with your gateway identifier, e.g. "razorpay" or "payu"
          gateway: 'example',
          // Replace with the merchant ID assigned by your gateway
          gatewayMerchantId: 'exampleGatewayMerchantId',
        },
      },
    },
  ],
  merchantInfo: {
    // Replace with your Google Pay merchant name and ID
    merchantName: 'AISmartKheti',
    merchantId: 'BCR2DN4TR2EXAMPLE', // TEST merchant ID
  },
  transactionInfo: {
    totalPriceStatus: 'FINAL',
    totalPrice: '50.00',
    currencyCode: 'INR',
    countryCode: 'IN',
    totalPriceLabel: '1-Year Subscription',
  },
};

export default function GooglePayButton({ onSuccess, onError, onCancel, onReadyToPayChange }: Props) {
  return (
    <div className="gpay-wrapper">
      <GooglePayButtonReact
        environment="TEST"
        paymentRequest={paymentRequest}
        buttonType="subscribe"
        buttonColor="black"
        buttonSizeMode="fill"
        buttonLocale="en"
        buttonRadius={12}
        className="gpay-button"
        onLoadPaymentData={onSuccess}
        onError={onError}
        onCancel={() => onCancel?.()}
        onReadyToPayChange={(result) => onReadyToPayChange?.(result.isReadyToPay)}
      />
      <p className="gpay-terms">
        Powered by Google Pay · Secured by Google
      </p>
    </div>
  );
}
