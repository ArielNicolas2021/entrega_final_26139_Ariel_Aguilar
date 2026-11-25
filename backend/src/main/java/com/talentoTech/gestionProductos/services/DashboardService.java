package com.talentoTech.gestionProductos.services;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.talentoTech.gestionProductos.dtos.DashboardResponse;
import com.talentoTech.gestionProductos.dtos.ProductoGanadorResponse;
import com.talentoTech.gestionProductos.repositories.VentaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService implements IDashboardService {

  private final VentaRepository ventaRepository;

  @Override
  @Transactional(readOnly = true)
  public DashboardResponse getMetricasMensuales(YearMonth periodo, int topLimit) {
    YearMonth targetPeriodo = (periodo != null) ? periodo : YearMonth.now();

    LocalDateTime inicio = targetPeriodo.atDay(1).atStartOfDay();
    LocalDateTime fin = targetPeriodo.atEndOfMonth().atTime(LocalTime.MAX);

    Double totalVentas = ventaRepository.sumTotalVentasByPeriodo(inicio, fin);
    Long totalTransacciones = ventaRepository.countVentasByPeriodo(inicio, fin);
    List<ProductoGanadorResponse> ganadores = ventaRepository.findTopProductosByPeriodo(
        inicio,
        fin,
        PageRequest.of(0, topLimit));

    return new DashboardResponse(
        targetPeriodo.toString(),
        totalVentas,
        totalTransacciones,
        ganadores);
  }
}