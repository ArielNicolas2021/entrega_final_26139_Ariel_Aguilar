package com.talentoTech.gestionProductos.services;

import java.time.YearMonth;
import com.talentoTech.gestionProductos.dtos.DashboardResponse;

public interface IDashboardService {
  DashboardResponse getMetricasMensuales(YearMonth periodo, int topLimit);
}