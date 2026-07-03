package com.talentoTech.gestionProductos.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.talentoTech.gestionProductos.categoria.model.CategoriaModel;
import com.talentoTech.gestionProductos.categoria.repository.CategoriaRepository;

@Component
public class DataLoader implements CommandLineRunner {

  private final CategoriaRepository categoriaRepository;

  public DataLoader(CategoriaRepository categoriaRepository) {
    this.categoriaRepository = categoriaRepository;
  }

  @Override
  public void run(String... args) throws Exception {

    if (categoriaRepository.count() == 0) {

      CategoriaModel tecnologia = new CategoriaModel();
      tecnologia.setNombre("Tecnología");
      tecnologia.setDescripcion("Productos tecnológicos");

      CategoriaModel hogar = new CategoriaModel();
      hogar.setNombre("Hogar");
      hogar.setDescripcion("Artículos para el hogar");

      CategoriaModel deportes = new CategoriaModel();
      deportes.setNombre("Deportes");
      deportes.setDescripcion("Equipamiento deportivo");

      categoriaRepository.save(tecnologia);
      categoriaRepository.save(hogar);
      categoriaRepository.save(deportes);

      System.out.println("Categorías precargadas.");
    }
  }
}