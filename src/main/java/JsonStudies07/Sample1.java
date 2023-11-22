package JsonStudies07;

import java.io.File;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

public class Sample1 {
	public static void main(String[] args) {
		Double temp = 0.0;
		String filePath = "C:\\Peter\\Studies/DisposalInstructionStep.json";

		ObjectMapper objectMapper = new ObjectMapper();
		try {
			File jsonFile = new File(filePath);
			Map<String, Object> jsonData = objectMapper.readValue(jsonFile, Map.class);

			List<Map<String, Object>> dataList = (List<Map<String, Object>>) jsonData.get("data");

			for (Map<String, Object> dataMap : dataList) {
//				Object elcDspAmt = dataMap.get("ACTIVE_CODE");
//				Object toBeDisposedAmt = dataMap.get("TYPE_CODE");
//				System.out.println("ELC_DSP_AMT: " + elcDspAmt);
//				System.out.println("TO_BE_DISPOSED_AMT: " + toBeDisposedAmt);
				List<Map<String, Object>> hs = (List<Map<String, Object>>) dataMap.get("FG_TRD_ACCOUNTS");
				for (Map<String, Object> data : hs) {
					Double ob = (Double) data.get("DSP_AMT");
					ob.doubleValue();
					temp += ob;
//					System.out.println(ob);
				}
			}
			System.out.println(temp);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
