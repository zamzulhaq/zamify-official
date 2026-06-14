import sys

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if '<!-- ═══════════════════════════════════════════' in line and i+1 < len(lines) and 'PRODUCT SHOWCASE' in lines[i+1]:
        start_idx = i
    if '<!-- ═══════════════════════════════════════════' in line and i+1 < len(lines) and 'FOOTER' in lines[i+1]:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    new_content = """  <!-- ═══════════════════════════════════════════
       LABS EXPLORE (Products & Ecosystem)
  ═══════════════════════════════════════════ -->
  <section id="explore" class="labs-explore" aria-labelledby="explore-title">
    <!-- Big playful blobs -->
    <div class="labs-blob labs-blob-yellow" aria-hidden="true"></div>
    <div class="labs-blob labs-blob-blue" aria-hidden="true"></div>

    <div class="section-container">
      <div class="labs-header">
        <h2 id="explore-title" class="labs-headline reveal-up">
          Be the first to <span class="text-blue">explore</span>
        </h2>
        <p class="labs-subheadline reveal-up" style="--delay: 0.1s">
          The Zamify Ecosystem. Three powerful products. One seamless experience.
        </p>
      </div>

      <div class="labs-cards-grid">
        <!-- Sellory -->
        <article class="labs-card reveal-up" style="--delay: 0.2s">
          <div class="labs-card-visual" style="background: #eef2ff;">
            <div class="labs-card-art sellory-art">
              <div class="mock-browser">
                <div class="mock-browser-top"><span></span><span></span><span></span></div>
                <div class="mock-chart" style="background: #6366f1"></div>
                <div class="mock-store-grid"><i style="background: rgba(99,102,241,0.2)"></i><i style="background: rgba(99,102,241,0.2)"></i><i style="background: rgba(99,102,241,0.2)"></i><i style="background: rgba(99,102,241,0.2)"></i></div>
              </div>
            </div>
          </div>
          <div class="labs-card-content">
            <span class="labs-card-tag" style="color: #6366f1; background: rgba(99,102,241,0.1)">Commerce</span>
            <h3 class="labs-card-title">Sellory</h3>
            <p class="labs-card-desc">Modern e-commerce platform for growing businesses.</p>
          </div>
        </article>

        <!-- Ebsensy -->
        <article class="labs-card reveal-up" style="--delay: 0.3s">
          <div class="labs-card-visual" style="background: #f3e8ff;">
            <div class="labs-card-art ebsensy-art">
              <div class="mock-phone">
                <div class="mock-phone-pill"></div>
                <div class="mock-attendance-card" style="background: #8b5cf6"></div>
                <div class="mock-attendance-list"><i style="background: rgba(139,92,246,0.2)"></i><i style="background: rgba(139,92,246,0.2)"></i><i style="background: rgba(139,92,246,0.2)"></i></div>
              </div>
            </div>
          </div>
          <div class="labs-card-content">
            <span class="labs-card-tag" style="color: #8b5cf6; background: rgba(139,92,246,0.1)">Operations</span>
            <h3 class="labs-card-title">Ebsensy</h3>
            <p class="labs-card-desc">Smart attendance and team management simplified.</p>
          </div>
        </article>

        <!-- Creatory -->
        <article class="labs-card reveal-up" style="--delay: 0.4s">
          <div class="labs-card-visual" style="background: #fae8ff;">
            <div class="labs-card-art creatory-art">
              <div class="mock-canvas">
                <div class="mock-canvas-shape shape-a" style="border-color: #d946ef"></div>
                <div class="mock-canvas-shape shape-b" style="border-color: #a855f7"></div>
                <div class="mock-canvas-tools"><i style="background: #d946ef"></i><i style="background: #a855f7"></i><i style="background: #c084fc"></i></div>
              </div>
            </div>
          </div>
          <div class="labs-card-content">
            <span class="labs-card-tag" style="color: #d946ef; background: rgba(217,70,239,0.1)">Creative</span>
            <h3 class="labs-card-title">Creatory</h3>
            <p class="labs-card-desc">Design, edit, and create with powerful AI tools.</p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       LABS CONNECT (Stats/CTA Footer)
  ═══════════════════════════════════════════ -->
  <section id="connect" class="labs-connect" aria-labelledby="connect-title">
    <div class="labs-connect-bg">
      <div class="labs-blob labs-blob-yellow-bottom"></div>
      <div class="labs-blob labs-blob-orange-bottom"></div>
    </div>
    
    <div class="section-container labs-connect-container">
      <h2 id="connect-title" class="labs-headline reveal-up">
        Stay connected for early access<br/>to our new experiments
      </h2>
      
      <div class="labs-connect-actions reveal-up" style="--delay: 0.1s">
        <a href="#" class="btn btn-pill-yellow">Sign up for the Labs newsletter</a>
        <a href="#" class="btn btn-pill-yellow">Become a trusted tester</a>
      </div>
      
      <div class="labs-social-footer reveal-up" style="--delay: 0.2s">
        <a href="#" class="labs-social-icon" aria-label="Discord">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
        </a>
        <a href="#" class="labs-social-icon" aria-label="Reddit">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.704.574-2.021 1.379l-4.329-1.015c-.189-.046-.381.063-.44.249l-1.654 5.207c-2.838.034-5.409.798-7.3 2.025-.474-.438-1.103-.712-1.796-.712-1.465 0-2.656 1.187-2.656 2.646 0 .97.533 1.811 1.317 2.271-.052.282-.086.567-.086.857 0 3.911 4.808 7.093 10.719 7.093s10.72-3.182 10.72-7.093c0-.274-.029-.544-.075-.81.832-.447 1.405-1.312 1.405-2.318zm-17.224 1.816c0-.868.71-1.575 1.582-1.575.872 0 1.581.707 1.581 1.575s-.709 1.574-1.581 1.574-1.582-.706-1.582-1.574zm9.061 4.669c-1.797 1.797-4.707 1.832-5.498 1.832-.789 0-3.699-.035-5.498-1.832l1.096-1.096c.928.928 2.502 1.385 4.402 1.385 1.897 0 3.471-.457 4.402-1.385l1.096 1.096zm.436-3.095c-.872 0-1.581-.706-1.581-1.574s.709-1.575 1.581-1.575c.871 0 1.58.707 1.58 1.575s-.709 1.574-1.58 1.574z"/></svg>
        </a>
        <a href="#" class="labs-social-icon" aria-label="X (Twitter)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
      </div>
    </div>
  </section>
"""
    
    lines = lines[:start_idx] + [new_content + '\n'] + lines[end_idx:]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Successfully replaced HTML sections!")
else:
    print(f"Could not find start or end markers. Start: {start_idx}, End: {end_idx}")
