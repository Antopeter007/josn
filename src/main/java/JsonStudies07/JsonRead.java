package JsonStudies07;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonRead {
	public static void main(String[] args) throws JsonParseException, JsonMappingException, IOException {
		File file = new File("C:\\Peter\\Studies/DisposalInstructionStep.json");
		ObjectMapper obj = new ObjectMapper();
		List<Map<String, Object>> hs = (List<Map<String, Object>>) obj.readValue(file, Map.class);

		System.out.println(hs);
//		List<Map<String, Object>> hs1 = (List<Map<String, Object>>) hs.get("FG_TRD_ACCOUNTS");
//		System.out.println(hs1);
//		JsonNode node = obj.readTree(file);
//		JsonNode root = node.get("data");
//		for (JsonNode example : root) {
//			String name = example.get("APPLICANT_PARTY").asText();
//			System.out.println(name);
//		}
	}
}
