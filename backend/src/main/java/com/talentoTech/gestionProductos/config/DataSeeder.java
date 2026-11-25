package com.talentoTech.gestionProductos.config;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.talentoTech.gestionProductos.models.Categoria;
import com.talentoTech.gestionProductos.models.Marca;
import com.talentoTech.gestionProductos.repositories.CategoriaRepository;
import com.talentoTech.gestionProductos.repositories.MarcaRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

  private final CategoriaRepository categoriaRepository;
  private final MarcaRepository marcaRepository;

  @Override
  @Transactional
  public void run(String... args) {
    if (categoriaRepository.count() > 0 || marcaRepository.count() > 0) {
      return;
    }

    Map<String, Categoria> categoriasMap = new LinkedHashMap<>();
    Map<String, Marca> marcasMap = new LinkedHashMap<>();

    registrarCategoriaConMarcas(categoriasMap, marcasMap,
        "Almacén",
        "Productos no perecederos de consumo diario como pastas secas, arroz, legumbres, aceites, harinas, conservas y condimentos.",
        List.of("Marolio", "Matarazzo", "Lucchetti", "Arroz Gallo", "Cocinero", "La Campagnola", "Natura", "Blancaflor",
            "Taragüi", "Playadito"));

    registrarCategoriaConMarcas(categoriasMap, marcasMap,
        "Bebidas",
        "Aguas minerales y saborizadas, gaseosas, jugos, infusiones, cervezas, vinos y bebidas espirituosas.",
        List.of("Villavicencio", "Villa del Sur", "Eco de los Andes", "Manaos", "Cunnington", "Baggio", "Terma",
            "Quilmes", "Andes Origen", "Trapiche"));

    registrarCategoriaConMarcas(categoriasMap, marcasMap,
        "Lácteos y Frescos",
        "Leches, yogures, manteca, cremas, postres refrigerados, tapas de empanadas y pastas frescas.",
        List.of("La Serenísima", "SanCor", "Ilolay", "Tregar", "Milkaut", "Tonadita", "Verónica", "Manfrey",
            "Mendicrim", "La Salteña"));

    registrarCategoriaConMarcas(categoriasMap, marcasMap,
        "Carnicería y Pescadería",
        "Cortes frescos de carne vacuna, cerdo, pollo, embutidos crudos, pescados y mariscos.",
        List.of("Swift", "Paladini", "Granja Tres Arroyos", "Cresta Roja", "Soychú", "Cabaña Las Lilas", "Friar",
            "Quickfood", "Mares del Sur", "Pesquera Veraz"));

    registrarCategoriaConMarcas(categoriasMap, marcasMap,
        "Frutas y Verduras",
        "Frutas de estación, hortalizas, vegetales de hoja verde, tubérculos y hierbas aromáticas frescas.",
        List.of("Moño Azul", "Tres Ases", "Gaucho", "Pai", "Tropical Argentina", "San Miguel", "Ledesma", "Sueño Verde",
            "Cosecha Criolla", "Tierra Fértil"));

    registrarCategoriaConMarcas(categoriasMap, marcasMap,
        "Panadería y Pastelería",
        "Pan fresco del día, facturas, galletitas, panificados envasados, budines y productos dulces.",
        List.of("Fargo", "Lactal", "Valente", "Veneziana", "Don Satur", "9 de Oro", "Bagley", "Terrabusi", "Tía Maruca",
            "Riera"));

    registrarCategoriaConMarcas(categoriasMap, marcasMap,
        "Fiambrería y Quesos",
        "Jamones, salames, fiambres feteados, quesos duros y semiduros, aceitunas y encurtidos.",
        List.of("Paladini", "Cagnoli", "Bocatti", "Lario", "Calchaquí", "Campo Austral", "La Paulina", "Santa Rosa",
            "Adler", "Nucete"));

    registrarCategoriaConMarcas(categoriasMap, marcasMap,
        "Congelados",
        "Vegetales supercongelados, hamburguesas, rebozados, papas prefritas, comidas listas y helados.",
        List.of("Paty", "Good Mark", "Unión Ganadera", "Granja del Sol", "Frizata", "Vegetalex", "La Salteña", "Grido",
            "Freddo", "Frigor"));

    registrarCategoriaConMarcas(categoriasMap, marcasMap,
        "Limpieza del Hogar",
        "Detergentes, lavandina, desinfectantes de ambientes y pisos, jabón para ropa, suavizantes y bolsas de residuos.",
        List.of("Ayudín", "Ala", "Magistral", "Procénex", "Poett", "Blem", "Querubín", "Zorro", "Virulana", "Asurin"));

    registrarCategoriaConMarcas(categoriasMap, marcasMap,
        "Perfumería y Cuidado Personal",
        "Productos de higiene y cuidado diario como shampoo, jabones, desodorantes, cuidado bucal, papel higiénico y pañales.",
        List.of("Plusbelle", "Algabo", "Veritas", "Campos Verdes", "Polyana", "Colbert", "Kevin", "Higienol", "Sussex",
            "Estrella"));

    categoriaRepository.saveAll(categoriasMap.values());
    marcaRepository.saveAll(marcasMap.values());
  }

  private void registrarCategoriaConMarcas(
      Map<String, Categoria> categoriasMap,
      Map<String, Marca> marcasMap,
      String nombreCategoria,
      String descripcionCategoria,
      List<String> nombresMarcas) {

    Categoria categoria = new Categoria();
    categoria.setNombre(nombreCategoria);
    categoria.setDescripcion(descripcionCategoria);
    categoriasMap.put(nombreCategoria, categoria);

    for (String nombreMarca : nombresMarcas) {
      Marca marca = marcasMap.computeIfAbsent(nombreMarca, nombre -> {
        Marca nueva = new Marca();
        nueva.setNombre(nombre);
        return nueva;
      });
      marca.addCategoria(categoria);
    }
  }
}