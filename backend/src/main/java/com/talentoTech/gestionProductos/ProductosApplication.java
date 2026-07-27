package com.talentoTech.gestionProductos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProductosApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductosApplication.class, args);
		System.out.println("-------------------- Aplicación de productos iniciada correctamente. --------------------");
	}

}
