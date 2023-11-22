package JsonStudies07;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.json.simple.parser.ParseException;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ReadJsonAndAscValues {
	public static void main(String[] args) throws FileNotFoundException, IOException, ParseException {
		
		File file = new File("C:\\Peter\\json/loanData.json");
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> userData = mapper.readValue(file, new TypeReference<Map<String, Object>>() {
		});
		List<Map<String, Object>> loans = (List<Map<String, Object>>) userData.get("loans");
		for (int i = 0; i < loans.size(); i++) {
			Map<String, Object> values = loans.get(i);
			String overdue = (String) values.get("overdue_y_n");
			if (overdue.equals("Y")) {
				List<Map<String, Object>> ascValues = new ArrayList<>();
				ascValues.add(values);
				System.out.println(ascValues);
			}
		}
	}
}
