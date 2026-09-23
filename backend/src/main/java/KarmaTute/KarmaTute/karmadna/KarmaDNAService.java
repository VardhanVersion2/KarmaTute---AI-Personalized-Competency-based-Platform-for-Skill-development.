package KarmaTute.KarmaTute.karmadna;

import KarmaTute.KarmaTute.competency.*;
import KarmaTute.KarmaTute.certificate.*;
import KarmaTute.KarmaTute.entity.*;
import KarmaTute.KarmaTute.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class KarmaDNAService {

    private final UserRepository userRepository;
    private final EvidenceRecordRepository evidenceRepository;
    private final CompetencySnapshotRepository snapshotRepository;
    private final CertificateRepository certificateRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public KarmaDNAService(UserRepository userRepository,
                           EvidenceRecordRepository evidenceRepository,
                           CompetencySnapshotRepository snapshotRepository,
                           CertificateRepository certificateRepository) {
        this.userRepository = userRepository;
        this.evidenceRepository = evidenceRepository;
        this.snapshotRepository = snapshotRepository;
        this.certificateRepository = certificateRepository;
    }

    public KarmaDNAExportResult exportDNA(Long userId) throws Exception {
        User user = userRepository.findById(userId).orElseThrow();
        
        Map<String, Object> dnaPayload = new HashMap<>();
        dnaPayload.put("user", user);
        dnaPayload.put("evidence", evidenceRepository.findAll().stream().filter(e->e.getUserId().equals(userId)).toList());
        dnaPayload.put("snapshots", snapshotRepository.findAll().stream().filter(s->s.getUserId().equals(userId)).toList());
        dnaPayload.put("certificates", certificateRepository.findByUserId(userId));
        dnaPayload.put("exportedAt", System.currentTimeMillis());
        dnaPayload.put("version", "v1.0.KarmaDNA");

        // Use jackson mapper to convert Java objects into JSON. Register module for LocalDateTime if necessary, but standard object mapper without it might fail if there are LocalDateTime fields.
        objectMapper.findAndRegisterModules(); 
        String json = objectMapper.writeValueAsString(dnaPayload);

        // Generate a 128-bit AES key
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(128);
        SecretKey secretKey = keyGen.generateKey();
        String encodedKey = Base64.getEncoder().encodeToString(secretKey.getEncoded());

        // Encrypt the JSON payload
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        byte[] encrypted = cipher.doFinal(json.getBytes(StandardCharsets.UTF_8));
        String encodedData = Base64.getEncoder().encodeToString(encrypted);

        return new KarmaDNAExportResult(encodedKey, encodedData);
    }

    public Map<String, Object> importDNA(String encodedData, String encodedKey) throws Exception {
        byte[] decodedKey = Base64.getDecoder().decode(encodedKey);
        SecretKey originalKey = new SecretKeySpec(decodedKey, 0, decodedKey.length, "AES");

        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, originalKey);
        byte[] original = cipher.doFinal(Base64.getDecoder().decode(encodedData));

        String json = new String(original, StandardCharsets.UTF_8);
        return objectMapper.readValue(json, Map.class);
    }
}
