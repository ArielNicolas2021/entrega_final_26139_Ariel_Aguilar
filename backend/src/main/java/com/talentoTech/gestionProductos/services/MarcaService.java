package com.talentoTech.gestionProductos.services;

import java.util.HashSet;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.talentoTech.gestionProductos.dtos.MarcaRequest;
import com.talentoTech.gestionProductos.dtos.MarcaResponse;
import com.talentoTech.gestionProductos.dtos.StatusResponse;
import com.talentoTech.gestionProductos.mapper.MarcaMapper;
import com.talentoTech.gestionProductos.models.Categoria;
import com.talentoTech.gestionProductos.models.Marca;
import com.talentoTech.gestionProductos.repositories.CategoriaRepository;
import com.talentoTech.gestionProductos.repositories.MarcaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MarcaService implements IMarcaService {

  private final MarcaRepository marcaRepository;
  private final CategoriaRepository categoriaRepository;
  private final MarcaMapper marcaMapper;

  /*
   * ========================
   * Obtener todas las marcas
   * ========================
   */
  @Override
  @Transactional(readOnly = true)
  public Page<MarcaResponse> getMarcas(Pageable pageable) {
    return marcaRepository.findAll(pageable).map(marcaMapper::toDTO);
  }

  /*
   * =======================
   * Obtener marca por su id
   * =======================
   */
  @Override
  @Transactional(readOnly = true)
  public MarcaResponse getMarcaById(Long id) {
    Marca marca = marcaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Marca no encontrada"));

    return marcaMapper.toDTO(marca);
  }

  /*
   * ===============
   * Crear una marca
   * ===============
   */
  @Override
  @Transactional
  public MarcaResponse createMarca(MarcaRequest marcaReq) {
    if (marcaRepository.existsByNombreIgnoreCase(marcaReq.nombre())) {
      throw new RuntimeException("Ya existe una marca con el nombre: " + marcaReq.nombre());
    }

    Categoria categoria = categoriaRepository.findById(marcaReq.categoriaID())
        .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

    Marca marca = marcaMapper.toEntity(marcaReq);
    marca.addCategoria(categoria);

    Marca savedMarca = marcaRepository.save(marca);
    return marcaMapper.toDTO(savedMarca);
  }

  /*
   * ==================
   * Eliminar una marca
   * ==================
   */
  @Override
  @Transactional
  public StatusResponse deleteMarca(Long id) {
    Marca marca = marcaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Marca no encontrada"));

    // Limpia la tabla intermedia 'categoria_marca' antes de borrar la marca
    for (Categoria categoria : new HashSet<>(marca.getCategorias())) {
      marca.removeCategoria(categoria);
    }

    marcaRepository.delete(marca);
    return StatusResponse.builder()
        .status(200)
        .message("Marca eliminada correctamente")
        .build();
  }

  /*
   * ===================
   * Modificar una marca
   * ===================
   */
  @Override
  @Transactional
  public MarcaResponse updateMarca(Long id, MarcaRequest marcaReq) {
    Marca marca = marcaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Marca no encontrada"));

    if (!marca.getNombre().equalsIgnoreCase(marcaReq.nombre())
        && marcaRepository.existsByNombreIgnoreCase(marcaReq.nombre())) {
      throw new RuntimeException("Ya existe otra marca con el nombre: " + marcaReq.nombre());
    }

    Categoria categoria = categoriaRepository.findById(marcaReq.categoriaID())
        .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

    marcaMapper.updateEntityFromRequest(marcaReq, marca);
    marca.addCategoria(categoria);

    Marca savedMarca = marcaRepository.save(marca);
    return marcaMapper.toDTO(savedMarca);
  }

  @Override
  @Transactional(readOnly = true)
  public List<MarcaResponse> getMarcasByCategoriaId(Long categoriaId) {
    if (!categoriaRepository.existsById(categoriaId)) {
      throw new RuntimeException("Categoría no encontrada");
    }

    return marcaRepository.findByCategoriasIdOrderByNombreAsc(categoriaId).stream()
        .map(marcaMapper::toDTO)
        .toList();
  }
}