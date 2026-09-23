package KarmaTute.KarmaTute.controller;

import KarmaTute.KarmaTute.dto.CommandCenterResponse;
import KarmaTute.KarmaTute.service.CommandCenterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class CommandCenterController {

    private final CommandCenterService commandCenterService;

    public CommandCenterController(CommandCenterService commandCenterService) {
        this.commandCenterService = commandCenterService;
    }

    @GetMapping({"/me/command-center", "/api/v1/me/command-center"})
    public ResponseEntity<CommandCenterResponse> getCommandCenter(
        @RequestParam(required = false) Long userId,
        @RequestParam(required = false) String state
    ) {
        CommandCenterResponse response = commandCenterService.getCommandCenter(userId, state);
        return ResponseEntity.ok(response);
    }
}
