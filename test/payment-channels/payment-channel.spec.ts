import { PaymentChannel } from "../../src/payment-channels/payment-channel";
import * as wasmSigningTools from "@blits-labs/filecoin-signing-tools/nodejs";
import {CodeCID, INIT_ACTOR, InitMethod} from "../../src/core/types/types";
import {serialize} from "v8";
import BigNumber from "bignumber.js";

describe("payment channels", () => {
    let paymentChannel: PaymentChannel;
    const mnemonic = "monitor chunk wheat damp mail deposit roof fruit comfort tray route admit";
    const publicKey =
        "0444fb0d74053b02cfa5d882c77b96a86d7cb6c12b0004bfc1417a256c8299be6cee718081af7e40b13d7f78f614cec259c40714887d60f9eed468a29658408258";
    const privateKey = "b144cf14dbd413aaefaa4658bca06733aa33386e651ab9816954807c74517bf1";
    const address = "t1vwxualsf6gx5jjl2fp7zh7gy6ailk4hnwgkroci";
    const to = "t1aexhfgaaowzz2wryy7b6q5y3zs7tjhybfmqetta";

    beforeEach(() => {
        paymentChannel = new PaymentChannel();
    });

    it("should encode the payment channel constructor params", async () => {
        const params = {
            code_cid: CodeCID.PaymentChannel,
            constructor_params: Buffer.from(wasmSigningTools.serializeParams({ from: address, to })).toString("base64"),
        };
        const wasmResult = Buffer.from(wasmSigningTools.serializeParams(params)).toString("base64");

        const result = await paymentChannel.createPayChMsgParams(address, to);

        expect(result).toEqual(wasmResult);
    });

    it("should create the payment channel creation message", async () => {
        const amount = new BigNumber(100);
        const params = {
            code_cid: CodeCID.PaymentChannel,
            constructor_params: Buffer.from(wasmSigningTools.serializeParams({ from: address, to })).toString("base64"),
        };
        const serializedParams = Buffer.from(wasmSigningTools.serializeParams(params)).toString("base64");

        const result = await paymentChannel.createPayChMsg(address, to, amount, 0);

        const expected = {
            From: address,
            To: "t01",
            Nonce: 0,
            Value: amount,
            GasLimit: 10000000,
            GasFeeCap: new BigNumber(0),
            GasPremium: new BigNumber(0),
            Method: 2,
            Params: serializedParams,
        }

        expect(result).toEqual(expected);
    });
});
