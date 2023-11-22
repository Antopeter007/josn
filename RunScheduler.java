package com.batch.job.jobexample.scheduler;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

/**
 * The Class RunScheduler.
 */
public class RunScheduler {

	/** The log. */
	private static Log LOG = LogFactory.getLog(RunScheduler.class);

	/** The class name. */
	private static String className = RunScheduler.class.getSimpleName() + " - ";

	/** The job launcher. */
	@Autowired
	JobLauncher jobLauncher;


	/** The application context. */
	@Autowired
	ApplicationContext applicationContext;

	/** The job name. */
	String jobName;

	/** The is enabled. */
	String isEnabled;

	/**
	 * Gets the job name.
	 *
	 * @return the job name
	 */
	public String getJobName() {
		return jobName;
	}

	/**
	 * Sets the job name.
	 *
	 * @param jobName
	 *            the new job name
	 */
	public void setJobName(String jobName) {
		this.jobName = jobName;
	}

	/**
	 * Gets the checks if is enabled.
	 *
	 * @return the checks if is enabled
	 */
	public String getIsEnabled() {
		return isEnabled;
	}

	/**
	 * Sets the checks if is enabled.
	 *
	 * @param isEnabled
	 *            the new checks if is enabled
	 */
	public void setIsEnabled(String isEnabled) {
		this.isEnabled = isEnabled;
	}

	/**
	 * Handle.
	 *
	 * @return the string
	 * @throws Exception
	 *             the exception
	 */
	public String handle() throws Exception {
		LOG.info(className + "_handle start ..");

		String jsonInString = "";
		try {
			LOG.info("Job Name : " + jobName);

			if (isEnabled == null)
				isEnabled = "true";

			if (isEnabled.equalsIgnoreCase("true")) {
				Job job = (Job) applicationContext.getBean(jobName);

				JobParameters paramJobParameters = new JobParametersBuilder()
						.addLong("time", System.currentTimeMillis()).addString("jobName", jobName)
						.toJobParameters();

				JobExecution jobExcution = jobLauncher.run(job, paramJobParameters);
				LOG.info(jobExcution.getJobId() + " # " + jobExcution.getCreateTime().toString());
			} else {
				LOG.info(jobName + " for this job schedule disabled..");
			}
		} catch (Exception e) {
			LOG.error(e.getMessage(), e);
			jsonInString = e.getMessage();
			LOG.error(e);
			LOG.error(e.getMessage());
		}
		LOG.info("handle end");
		return jsonInString;
	}

}
