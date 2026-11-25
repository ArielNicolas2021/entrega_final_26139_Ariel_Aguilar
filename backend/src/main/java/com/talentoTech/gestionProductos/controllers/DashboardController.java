package com.talentoTech.gestionProductos.controllers;

import java.time.YearMonth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.talentoTech.gestionProductos.dtos.DashboardResponse;
import com.talentoTech.gestionProductos.services.IDashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

  private final IDashboardService dashboardService;

  @GetMapping
  public ResponseEntity<DashboardResponse> getDashboard(
      @RequestParam(required = false) YearMonth periodo,
      @RequestParam(defaultValue = "5") int limit) {
    return ResponseEntity.ok(dashboardService.getMetricasMensuales(periodo, limit));
  }
}