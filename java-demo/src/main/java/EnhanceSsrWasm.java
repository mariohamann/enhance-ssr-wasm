
import org.extism.sdk.Plugin;
import org.extism.sdk.manifest.Manifest;
import org.extism.sdk.wasm.PathWasmSource;

import java.util.List;
import java.util.Map;

public class EnhanceSsrWasm {
    public static void main(String[] args) {
        try {
            // Hint: path starts from the root of the java project
            String wasmPath = "../wasm/dist/enhance-ssr.wasm"; 
            String wasmName = "enhance-ssr";
            String wasmHash = "f9da5d32e92e84c737ac1d1d03796ffb80d619d122d4580cec433fb427de9157";

            Manifest manifest = new Manifest(List.of(new PathWasmSource(wasmName, wasmPath, wasmHash)));
            Plugin plugin = new Plugin(manifest, true, null);

            Map<String, Object> input = Map.of(
                    "markup", "<my-header>Hello world!</my-header>",
                    "elements", Map.of(
                            "my-header", "function MyHeader({ html }) { return html`<h1><slot></slot></h1> ` }"
                    ),
                    "initialState", List.of()
            );

            String inputJson = new com.google.gson.Gson().toJson(input);

            String output = plugin.call("ssr", inputJson);

            System.out.println("Output: " + output);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
