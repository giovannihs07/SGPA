package com.sgpa.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    basePackages = "com.universidad.repository",
    entityManagerFactoryRef = "universidadEntityManager",
    transactionManagerRef = "universidadTransactionManager"
)
public class UniversidadDataSourceConfig {

    @Bean
    @ConfigurationProperties("spring.datasource.universidad")
    public DataSource universidadDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean universidadEntityManager(
            @Qualifier("universidadDataSource") DataSource dataSource) {

        LocalContainerEntityManagerFactoryBean factory =
            new LocalContainerEntityManagerFactoryBean();

        factory.setDataSource(dataSource);
        factory.setPackagesToScan("com.universidad.model");
        factory.setPersistenceUnitName("universidad");

        HibernateJpaVendorAdapter adapter = new HibernateJpaVendorAdapter();
        factory.setJpaVendorAdapter(adapter);

        Properties props = new Properties();
        props.put("hibernate.hbm2ddl.auto", "update");
        props.put("hibernate.dialect",
            "org.hibernate.dialect.PostgreSQLDialect");
        factory.setJpaProperties(props);

        return factory;
    }

    @Bean
    public PlatformTransactionManager universidadTransactionManager(
            @Qualifier("universidadEntityManager")
            LocalContainerEntityManagerFactoryBean factory) {
        return new JpaTransactionManager(factory.getObject());
    }
}