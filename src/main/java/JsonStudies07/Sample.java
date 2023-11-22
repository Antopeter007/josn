package JsonStudies07;

import java.io.File;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

public class Sample {
	public static void main(String[] args) {
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			File jsonFile = new File("C:\\Peter\\Studies/Peter1.json");
			List<Map<String, Object>> dataList = objectMapper.readValue(jsonFile,
					objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));

			for (Map<String, Object> dataMap : dataList) {
				Object value1 = dataMap.get("LAST_UPDATED_BY");

				System.out.println("STATUS_CODE: " + value1);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}